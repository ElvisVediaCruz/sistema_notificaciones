import Group from "../models/Group.model.js";
import GroupMember from "../models/GroupMember.model.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

class GroupService {
    async createGroup(name, admin_id) {
        const count = await Group.count({where: { admin_id: admin_id}});
        if(count >= 2) throw new Error("ya alcanzaste el limite de grupos");
        return Group.create({ name, admin_id });
    }

    async getGroupsByAdmin(admin_id) {
        return Group.findAll({ where: { admin_id } });
    }

    async getMemberGroup(user_id) {
        const membership = await GroupMember.findOne({
            where: { user_id },
            include: [{ model: Group }]
        });
        if (!membership) throw new Error("No perteneces a ningún grupo");
        return membership.Group;
    }

    async addMember(group_id, user_id, admin_id) {
        const group = await Group.findOne({ where: { id: group_id, admin_id } });
        if (!group) throw new Error("Grupo no encontrado");
        const user = await User.findByPk(user_id);
        if (!user) throw new Error("Usuario no encontrado");
        const already = await GroupMember.findOne({ where: { group_id, user_id } });
        if (already) throw new Error("El usuario ya es miembro del grupo");
        return GroupMember.create({ group_id, user_id });
    }

    async removeMember(group_id, user_id, admin_id) {
        const group = await Group.findOne({ where: { id: group_id, admin_id } });
        if (!group) throw new Error("Grupo no encontrado");
        const member = await GroupMember.findOne({ where: { group_id, user_id } });
        if (!member) throw new Error("El usuario no es miembro del grupo");
        await member.destroy();
        return true;
    }

    async createWorker(group_id, data, admin_id) {
        const count = await GroupMember.count({where: { group_id: group_id}});
        if(count >= 5) throw new Error("ya alcanzaste el limite de usuarios");
        const group = await Group.findOne({ where: { id: group_id, admin_id } });
        if (!group) throw new Error("Grupo no encontrado");
        const exists = await User.findOne({ where: { user_name: data.user_name } });
        if (exists) throw new Error("El nombre de usuario ya está en uso");
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await User.create({ user_name: data.user_name, password: hashed, type: "usuario" });
        await GroupMember.create({ group_id, user_id: user.id_user });
        const { password, ...safe } = user.toJSON();
        return safe;
    }

    async updateGroup(group_id, name, admin_id) {
        const group = await Group.findOne({ where: { id: group_id, admin_id } });
        if (!group) throw new Error("Grupo no encontrado");
        if (group.name === name) return group;
        group.name = name;
        await group.save();
        return group;
    }

    async deleteGroup(group_id, admin_id) {
        const group = await Group.findOne({ where: { id: group_id, admin_id } });
        if (!group) throw new Error("Grupo no encontrado");
        const members = await GroupMember.findAll({ where: { group_id } });
        const userIds = members.map(m => m.user_id);
        await GroupMember.destroy({ where: { group_id } });
        if (userIds.length > 0) {
            await User.destroy({ where: { id_user: userIds, type: "usuario" } });
        }
        await group.destroy();
        return true;
    }

    async getMembers(group_id, admin_id) {
        const group = await Group.findOne({ where: { id: group_id, admin_id } });
        if (!group) throw new Error("Grupo no encontrado");
        return GroupMember.findAll({
            where: { group_id },
            include: [{
                model: User,
                as: "member",
                attributes: ["id_user", "user_name", "type"]
            }]
        });
    }
}

const groupService = new GroupService();
export default groupService;
