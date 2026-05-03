import jwt from "jsonwebtoken";
import GroupMember from "../models/GroupMember.model.js";
import Group from "../models/Group.model.js";

export const authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token requerido" });
    }
    try {
        req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.type !== "administrador") {
        return res.status(403).json({ error: "Solo administradores" });
    }
    next();
};

// Resolves the admin's id_user and attaches it to req.adminId.
// Admins use their own id; workers use the id of their group's admin.
export const resolveAdminId = async (req, res, next) => {
    if (req.user.type === "administrador") {
        req.adminId = req.user.id_user;
        return next();
    }
    try {
        const membership = await GroupMember.findOne({
            where: { user_id: req.user.id_user },
            include: [{ model: Group, attributes: ["admin_id"] }]
        });
        if (!membership) {
            return res.status(403).json({ error: "No perteneces a ningún grupo de trabajo" });
        }
        req.adminId = membership.Group.admin_id;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
