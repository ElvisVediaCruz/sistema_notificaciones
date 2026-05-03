import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import State from "../models/State.model.js";
import ProcessState from "../models/ProcessState.model.js";

class Dashboard {
    async getDashboard(adminId) {
        const [totalClients, totalProcess, totalStates, totalProcessState] = await Promise.all([
            Client.count({ where: { id_user: adminId, active: true } }),
            Process.count({
                where: { active: true},
                include: [{
                    model: Client,
                    where: { id_user: adminId },
                    attributes: [],
                    required: true
                }]
            }),
            State.count({ where: { id_user: adminId } }),

            Process.count({
                where: { active: true },
                include: [
                    {
                    model: ProcessState,
                    where: { active: false },
                    required: true
                    },
                    {
                    model: Client,
                    where: { id_user: adminId },
                    required: true
                    }
                ],
                distinct: true
                })
        ]);
        return [ totalClients, totalProcess, totalStates, totalProcessState ];
    }

    async clientsDashboard(adminId) {
        return Client.findAll({
            where: { id_user: adminId },
            order: [["id_client", "DESC"]],
            limit: 5
        });
    }
}

const dashboard = new Dashboard();
export default dashboard;
