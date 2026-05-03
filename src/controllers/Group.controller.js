import groupService from "../services/Group.service.js";

class GroupController {
    async create(req, res) {
        try {
            const group = await groupService.createGroup(req.body.name, req.user.id_user);
            res.created(group);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async getMyGroups(req, res) {
        try {
            const result = req.user.type === "administrador"
                ? await groupService.getGroupsByAdmin(req.user.id_user)
                : await groupService.getMemberGroup(req.user.id_user);
            res.ok(result);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async addMember(req, res) {
        try {
            const member = await groupService.addMember(
                req.params.id, req.body.user_id, req.user.id_user
            );
            res.created(member);
        } catch (error) {
            res.badRequest(error.message);
        }
    }

    async removeMember(req, res) {
        try {
            await groupService.removeMember(
                req.params.id, req.params.user_id, req.user.id_user
            );
            res.ok({ message: "Miembro eliminado del grupo" });
        } catch (error) {
            res.badRequest(error.message);
        }
    }

    async getMembers(req, res) {
        try {
            const members = await groupService.getMembers(req.params.id, req.user.id_user);
            res.ok(members);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async update(req, res) {
        try {
            const group = await groupService.updateGroup(
                req.params.id, req.body.name, req.user.id_user
            );
            res.ok(group);
        } catch (error) {
            res.badRequest(error.message);
        }
    }

    async deleteGroup(req, res) {
        try {
            await groupService.deleteGroup(req.params.id, req.user.id_user);
            res.ok({ message: "Grupo eliminado" });
        } catch (error) {
            res.badRequest(error.message);
        }
    }

    async createWorker(req, res) {
        try {
            const worker = await groupService.createWorker(
                req.params.id, req.body, req.user.id_user
            );
            res.created(worker);
        } catch (error) {
            res.badRequest(error.message);
        }
    }
}

const groupController = new GroupController();
export default groupController;
