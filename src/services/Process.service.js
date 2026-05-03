import sequelize from "../config/connect.js";
import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import ProcessState from "../models/ProcessState.model.js";
import State from "../models/State.model.js";
import baseService from "./Base.service.js";
import { calculateNextAlertDate, advanceAlertDate } from "../functions/normalize.js";

class ProcessService {
    async createProcess(data_process, adminId) {
        
        const t = await sequelize.transaction();
        try {
            const client = await Client.findOne({
                where: { id_client: data_process.id_client, id_user: adminId },
                attributes: ["id_client"],
                transaction: t
            });
            if (!client) throw new Error("el cliente no existe o no tienes acceso");
            data_process.time_process = calculateNextAlertDate(data_process.day_alert);
            const process = await Process.create(data_process, { transaction: t });
            const states = await State.findAll({
                attributes: ["id_state"],
                where: { id_user: adminId },
                transaction: t
            });
            if (states.length === 0) {
                throw new Error("Debes crear al menos un estado antes de registrar un trámite");
            }
            const values = states.map((state) => ({
                id_process: process.id_process,
                id_state: state.id_state
            }));
            await ProcessState.bulkCreate(values, { transaction: t });
            const totalMonth = await Process.sum("price", {
                where: { id_client: data_process.id_client, active: true },
                transaction: t
            });
            await Client.update(
                { price_month: totalMonth ?? 0 },
                { where: { id_client: data_process.id_client }, transaction: t }
            );

            await t.commit();
            return process;
        } catch (error) {
            await t.rollback();
            throw new Error("Error al crear el tramite: " + error.message);
        }
    }

    async updateProcess(data, id_process, id_client, adminId) {
        const client = await Client.findOne({
            where: { id_client, id_user: adminId },
            attributes: ["id_client"]
        });
        if (!client) throw new Error("el cliente no existe o no tienes acceso");
        const process = await Process.findOne({ where: { id_client, id_process } });
        if (!process) throw new Error("No se pudo encontrar el registro");
        const current = process.toJSON();
        let hasChanges = false;
        const fieldsToCompare = ["name", "price", "day_alert", "active"];
        for (const key of fieldsToCompare) {
            if (data[key] != null && data[key] != current[key]) { hasChanges = true; break; }
        }
        if (!hasChanges) return process;
        if (data.day_alert != null && data.day_alert != current.day_alert) {
            data.time_process = calculateNextAlertDate(data.day_alert);
            data.notified = false;
            data.notified_due = false;
        }
        await process.update(data);
        const totalMonth = await Process.sum("price", { where: { id_client, active: true } });
        await Client.update({ price_month: totalMonth ?? 0 }, { where: { id_client } });
        return process;
    }

    async getAllProcessClients(id_client, adminId) {
        const clients = await Client.findAll({
            where: { id_client, id_user: adminId },
            attributes: ["id_client", "name", "active"],
            include: {
                model: Process,
                attributes: ["id_process", "name", "price", "time_process", "active"],
                include: {
                    model: ProcessState,
                    attributes: ["id_procces_state", "active", "id_process", "id_state"],
                    include: { model: State, attributes: ["id_state", "name"] }
                }
            },
            order: [[Process, "active", "DESC"]]
        });
        if (clients.length === 0) throw new Error("no se encontraron tramites");
        return clients;
    }

    async getAllProcessByClientId(id_client, id_process, adminId) {
        const client = await Client.findOne({
            where: { id_client, id_user: adminId },
            attributes: ["id_client", "name"],
            include: [{
                model: Process,
                attributes: ["id_process", "name", "price", "time_process"],
                include: [{
                    model: ProcessState,
                    where: { id_process },
                    attributes: ["id_procces_state", "active"],
                    include: [{ model: State, attributes: ["id_state", "name"] }]
                }]
            }]
        });
        if (!client) throw new Error("no se encontro el cliente o no tienes acceso");
        return client;
    }

    async updateActiveProcess(id_process, adminId, active) {
        const process = await Process.findOne({ where: { id_process } });
        if (!process) throw new Error("tramite no encontrado");
        const client = await Client.findOne({ where: { id_client: process.id_client, id_user: adminId } });
        if (!client) throw new Error("Sin acceso al tramite");
        await process.update({ active });
        const totalMonth = await Process.sum("price", { where: { id_client: process.id_client, active: true } });
        await Client.update({ price_month: totalMonth ?? 0 }, { where: { id_client: process.id_client } });
        return process;
    }

    async getByIdProcess(id_process, adminId) {
        const process = await Process.findOne({
            where: { id_process },
            include: {
                model: ProcessState,
                attributes: ["id_procces_state", "active", "id_process", "id_state"],
                include: { model: State, attributes: ["id_state", "name"] }
            }
        });
        if (!process) throw new Error("no se encontro el tramite");
        const client = await Client.findOne({
            where: { id_client: process.id_client, id_user: adminId }
        });
        if (!client) throw new Error("Sin acceso al tramite");
        return process;
    }
}


const processService = new ProcessService();
export default processService;

export async function updateDate(today) {
    const processes = await Process.findAll({ where: { time_process: today } });
    for (const process of processes) {
        await ProcessState.update({ active: false }, { where: { id_process: process.id_process } });
        const newTimeProcess = advanceAlertDate(process.day_alert, process.time_process);
        await process.update({ time_process: newTimeProcess, notified: false, notified_due: false });
    }
}
