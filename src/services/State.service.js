import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import State from "../models/State.model.js";
import ProcessState from "../models/ProcessState.model.js";
import { Op } from "sequelize";
import sequelize from "../config/connect.js";

class StateService {
    async createState(data, adminId) {
        console.log("ingreso")
        return sequelize.transaction(async (t) => {
            const exist = await State.findOne({ where: { name: data.name, id_user: adminId }, transaction: t });
            if (exist) throw new Error("El estado ya existe");

            const newState = await State.create({ ...data, id_user: adminId }, { transaction: t });

            const processes = await Process.findAll({
                attributes: ["id_process"],
                include: { model: Client, where: { id_user: adminId }, attributes: [] },
                transaction: t,
            });

            if (processes.length > 0) {
                const bulkData = processes.map((proc) => ({
                    active: false,
                    id_state: newState.id_state,
                    id_process: proc.id_process,
                }));
                await ProcessState.bulkCreate(bulkData, { transaction: t });
            }

            return newState;
        });
    }

    async updateState(data, id_state, adminId) {
        const stateExist = await State.findOne({
            where: {
                name: data.name,
                id_user: adminId,
                id_state: { [Op.ne]: id_state }
            }
        });
        if (stateExist) throw new Error("el estado ya existe");

        const state = await State.findOne({ where: { id_state, id_user: adminId } });
        if (!state) throw new Error("el estado no está registrado");

        if (state.name === data.name) return state;

        state.name = data.name;
        await state.save();
        return state;
    }

    async getAllState(adminId) {
        return State.findAll({ where: { id_user: adminId } });
    }

    async getByIdState(id_state, adminId) {
        const state = await State.findOne({ where: { id_state, id_user: adminId } });
        if (!state) throw new Error("Estado no registrado");
        return state;
    }

    async deleteState(id_state, adminId) {
        const state = await State.findOne({
            where: { id_state, id_user: adminId }
        });
        if (!state) throw new Error("Estado no registrado");
        await state.destroy();
        return true;
    }
}

const stateService = new StateService();
export default stateService;
