import ProcessState from "../models/ProcessState.model.js";
import Process from "../models/Process.model.js";
import Client from "../models/Clients.model.js";
import { Op, where } from "sequelize";
import State from "../models/State.model.js";

class ProcesStateService {
    async update(data, id_process, adminId) {
        const process = await Process.findOne({
            where: { id_process },
            include: [{
                model: Client,
                where: { id_user: adminId },
                attributes: [],
                required: true
            }]
        });
        if (!process) throw new Error("Proceso no encontrado o sin acceso");

        await Promise.all(
            data.map((item) =>
                ProcessState.update(
                    { active: item.active },
                    {
                        where: {
                            id_procces_state: item.id_process_state,
                            id_process,
                            id_state: item.id_state,
                            active: { [Op.ne]: item.active }
                        }
                    }
                )
            )
        );
        return true;
    }
    // esto actualizara automaticamente con el cromjob
    async updateMonthState(dateNow){
        const process = await Process.findAll({
            where: { time_process: dateNow },
            attributes: ["id_process"]
        });
        if(process.length === 0) return true;
        const ids = process.map(p => p.id_process)
        await ProcessState.update(
            { active: false},
            {
                where: {
                    active: true,
                    id_process: ids
                }
            }
        )
        return true;
    }
}

const procesStateService = new ProcesStateService();
export default procesStateService;
