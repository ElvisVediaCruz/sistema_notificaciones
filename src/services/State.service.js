import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import State from "../models/State.model.js";
import ProcessState from "../models/ProcessState.model.js";
import { Op } from "sequelize";
import sequelize from "../config/connect.js";

class StateService {
    async createState(data, adminId) {
        const t = sequelize.transaction()
        try {
            const exist = await State.findOne({ where: { name: data.name, id_user: adminId}});
            if(exist) throw new Error("El estado ya existe");
            const newState = await State.create({ ...data, id_user: adminId });
            const process = await Process.findAll({
                attributes: ["id_process"],
                include: {
                    model: Client,
                    where: {id_user: adminId}
                }
            });
            if(process.length > 0){
                const bulkData = process.map(proc => ({
                    active: false,
                        id_state: newState.id_state,
                        id_process: proc.id_process
                }));
                await ProcessState.bulkCreate(bulkData);
            }
            return newState;
        } catch (error) {
            throw new Error( error.message);
        }
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
