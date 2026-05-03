import processService from "../services/Process.service.js";

class ProcessController {
    async create(req, res) {
        const { id_client } = req.params;
        const { name, price, day_alert } = req.body;
        try {
            const process = await processService.createProcess(
                { name, price, day_alert, id_client },
                req.adminId
            );
            res.created(process);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async getAllClients(req, res) {
        const { id_client } = req.params;
        try {
            const data = await processService.getAllProcessClients(id_client, req.adminId);
            res.ok(data);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async getAllByClient(req, res) {
        const { id_client, id_process } = req.params;
        try {
            const processes = await processService.getAllProcessByClientId(
                id_client, id_process, req.adminId
            );
            res.ok(processes);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async getById(req, res) {
        const { id_process } = req.params;
        try {
            const process = await processService.getByIdProcess(id_process, req.adminId);
            res.ok(process);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async update(req, res) {
        const { id_client, id_process } = req.params;
        try {
            const process = await processService.updateProcess(
                req.body, id_process, id_client, req.adminId
            );
            res.ok(process);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async updateActive(req, res) {
        const { id_process } = req.params;
        const { active } = req.body;
        try {
            const process = await processService.updateActiveProcess(id_process, req.adminId, active);
            res.ok(process);
        } catch (error) {
            res.notFound(error.message);
        }
    }
}

const processController = new ProcessController();
export default processController;
