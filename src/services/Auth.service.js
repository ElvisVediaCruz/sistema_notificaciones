import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import GroupMember from "../models/GroupMember.model.js";

class AuthService {
    async register(data) {
        const exists = await User.findOne({ where: { user_name: data.user_name } });
        if (exists) throw new Error("Usuario ya registrado");
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await User.create({ ...data, password: hashed, type: "administrador" });
        const { password, ...safe } = user.toJSON();
        return safe;
    }

    async login(user_name, password) {
        const user = await User.findOne({ where: { user_name } });
        if (!user) throw new Error("Credenciales incorrectas");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Credenciales incorrectas");
        const token = jwt.sign(
            { id_user: user.id_user, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        return { token, type: user.type };
    }

    async updatePassword(passwordOld, passwordNew, id_user){
        const user = await User.findByPk(id_user);
        if(!user) throw new Error("Ususario no encontrado");
        const valid = await bcrypt.compare(passwordOld, user.password);
        if(!valid) throw new Error("Credenciales incorrectas");
        const same = await bcrypt.compare(passwordNew, user.password);
        if(same) throw new Error("La nueva contraseña no puede ser igual a la anterior")
        const hashed = await bcrypt.hash(passwordNew, 10);
        await user.update({ password: hashed });
        const { password, ...safe} = user.toJSON();
        return safe;
    }
    async deleteUser(id_user, adminId){
        if(id_user === adminId) throw new Error("No puedes eliminarte a ti mismo");
        const user = await User.findOne({
            where: {id_user: id_user, type: "usuario"}
        });
        if(!user) throw new Error("usuario no encontrado");
        await GroupMember.destroy({ where: { user_id: id_user } });
        await user.destroy();
        return true;
    }
}

const authService = new AuthService();
export default authService;
