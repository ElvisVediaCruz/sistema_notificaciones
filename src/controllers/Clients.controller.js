import clientService from "../services/Client.service.js";

class ClientController {
    async create(req, res) {
        const { name, nit, price_year } = req.body;
        try {
            const client = await clientService.createClient({
                name, nit, price_year, id_user: req.adminId
            });
            res.created(client);
        } catch (error) {
            res.badRequest(error.message);
        }
    }

    async getAll(req, res) {
        try {
            const clients = await clientService.getAllClient(req.adminId);
            res.ok(clients);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const client = await clientService.getByIdClient(id, req.adminId);
            res.ok(client);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        try {
            const client = await clientService.updateClient(req.body, id, req.adminId);
            res.ok(client);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async updateActive(req, res) {
        const { id } = req.params;
        const { active } = req.body;
        try {
            const client = await clientService.updateActiveClient(id, req.adminId, active);
            res.ok(client);
        } catch (error) {
            res.notFound(error.message);
        }
    }

    async getStatus(req, res) {
        try {
            const clients = await clientService.getClientsWithStatus(req.adminId);
            res.ok(clients);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async deleteClient(req, res) {
        const { id } = req.params;
        try {
            await clientService.deleteClient(id, req.adminId);
            res.ok({ message: "Cliente eliminado correctamente" });
        } catch (error) {
            res.notFound(error.message);
        }
    }
}

const clientController = new ClientController();
export default clientController;
