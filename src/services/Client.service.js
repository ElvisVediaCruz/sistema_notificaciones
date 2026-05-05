import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import ProcessState from "../models/ProcessState.model.js";
import baseService from "./Base.service.js";
import { Op } from "sequelize";

class ClientService {
    async createClient(data) {
        try {
            const clientExist = await Client.findOne({ where: { nit: data.nit } });
            if (clientExist) throw "El cliente ya esta registrado";
            return baseService.create(Client, data);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllClient(id_user) {
        if (!id_user) throw new Error("Admin no identificado");
        return Client.findAll({ where: { id_user }, order: [["active", "DESC"]] });
    }

    async getByIdClient(id_client, id_user) {
        const client = await Client.findOne({ where: { id_client, id_user } });
        if (!client) throw new Error("cliente no registrado");
        return client;
    }

    async updateClient(data, id_client, id_user) {
        const nitExist = await Client.count({
            where: {
                nit: data.nit,
                id_client: { [Op.ne]: id_client }
            }
        });
        if (nitExist > 0) throw new Error("nit ya registrado existente");
        const client = await Client.findOne({
            where: { id_client, id_user },
            attributes: ["id_client", "name", "nit", "price_year", "active"]
        });
        if (!client) throw new Error("cliente no registrado");
        const current = client.toJSON();
        let hasChanges = false;
        const fieldsToCompare = ["name", "nit", "price_year", "active"];
        for (const key of fieldsToCompare) {
            if (data[key] != current[key]) {
                hasChanges = true;
                break;
            }
        }
        if (!hasChanges) return client;
        await client.update(data);
        return client;
    }

    async updateActiveClient(id_client, id_user, active) {
        const client = await Client.findOne({ where: { id_client, id_user } });
        if (!client) throw new Error("cliente no registrado");
        await client.update({ active });
        return client;
    }

    async deleteClient(id_client, id_user) {
        const client = await Client.findOne({ where: { id_client, id_user } });
        if (!client) throw new Error("cliente no registrado");
        await client.destroy();
        return true;
    }

    async getClientsWithStatus(adminId) {
        const clients = await Client.findAll({
            where: { id_user: adminId },
            attributes: ["id_client", "name", "nit", "price_month", "price_year", "active"],
            include: [{
                model: Process,
                attributes: ["id_process", "active"],
                include: [{ model: ProcessState, attributes: ["active"] }],
                required: false
            }],
            order: [["active", "DESC"]]
        });

        return clients.map(client => {
            const { Processes, ...clientData } = client.toJSON();
            const processes = Processes || [];

            let tramite_status;
            if (processes.length === 0) {
                tramite_status = "sin_realizar";
            } else {
                const activeProcesses = processes.filter(p => p.active !== false);
                if (activeProcesses.length === 0) {
                    tramite_status = "terminados";
                } else {
                    const allDone = activeProcesses.every(p =>
                        p.Process_states?.length > 0 &&
                        p.Process_states.every(ps => ps.active === true)
                    );
                    tramite_status = allDone ? "terminados" : "pendientes";
                }
            }

            const allStates = processes.flatMap(p => p.Process_states || []);
            const pendiente = allStates.some(ps => ps.active === false);
            const terminado = allStates.some(ps => ps.active === true);

            return { ...clientData, tramite_status, pendiente, terminado };
        });
    }
}

const clientService = new ClientService();
export default clientService;
