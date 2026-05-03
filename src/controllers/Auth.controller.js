import authService from "../services/Auth.service.js";
import User from "../models/User.model.js";

class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.created(user);
        } catch (error) {
            res.badRequest(error.message);
        }
    }

    async login(req, res) {
        try {
            const { user_name, password } = req.body;
            const result = await authService.login(user_name, password);
            res.ok(result);
        } catch (error) {
            res.unauthorized(error.message);
        }
    }

    async updateFcmToken(req, res) {
        const { fcm_token } = req.body;
        if (!fcm_token) return res.badRequest("fcm_token es requerido");
        await User.update({ fcm_token }, { where: { id_user: req.user.id_user } });
        res.ok({ message: "Token registrado" });
    }

    async updatePassword(req, res) {
        try {
            const { passwordOld, passwordNew } = req.body;
            const result = await authService.updatePassword(passwordOld, passwordNew, req.user.id_user);
            res.ok(result);
        } catch (error) {
            res.unauthorized(error.message);
        }
    }

    async deleteUser(req, res) {
        try {
            const id_user = parseInt(req.params.id_user);
            await authService.deleteUser(id_user, req.user.id_user);
            res.ok({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.badRequest(error.message);
        }
    }
}

const authController = new AuthController();
export default authController;
