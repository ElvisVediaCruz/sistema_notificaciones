import Client from "../models/Clients.model.js";
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
        const nitExist = await Client.findOne({
            where: {
                nit: data.nit,
                id_client: { [Op.ne]: id_client }
            }
        });
        if (nitExist) throw new Error("nit ya registrado existente");
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
}

const clientService = new ClientService();
export default clientService;
