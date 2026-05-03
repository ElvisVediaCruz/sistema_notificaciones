import stateService from "../services/State.service.js";

class StateController {
    async create(req, res) {
        try {
            const state = await stateService.createState(req.body, req.adminId);
            res.created(state);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async getAll(req, res) {
        try {
            const states = await stateService.getAllState(req.adminId);
            res.ok(states);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const state = await stateService.getByIdState(id, req.adminId);
            res.ok(state);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        try {
            const state = await stateService.updateState(req.body, id, req.adminId);
            res.ok(state);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async deleteState(req, res) {
        const { id } = req.params;
        try {
            await stateService.deleteState(id, req.adminId);
            res.ok({ message: "Estado eliminado correctamente" });
        } catch (error) {
            res.notFound(error.message);
        }
    }
}

const stateController = new StateController();
export default stateController;
