import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import State from "../models/State.model.js";
import ProcessState from "../models/ProcessState.model.js";
import { Op, Sequelize } from "sequelize";

class Dashboard {
    async getDashboard(adminId) {
        const [totalClients, totalProcess, totalStates, totalProcessState, clientes] = await Promise.all([
        Client.count({
        where: { id_user: adminId, active: true }
        }),
        Client.count({
            where: {
                id_user: adminId,
                id_client: {
                    [Op.in]: Sequelize.literal(`(
                        SELECT DISTINCT p.id_client FROM process p
                        WHERE p.id_process NOT IN (
                            SELECT id_process FROM processtates WHERE active = false
                        )
                    )`)
                }
            }
        }),
        State.count({
        where: { id_user: adminId }
        }),
        Client.count({
            where: {
                id_user: adminId,
                id_client: {
                    [Op.in]: Sequelize.literal(`(
                        SELECT DISTINCT p.id_client FROM process p
                        INNER JOIN processtates ps ON ps.id_process = p.id_process
                        WHERE ps.active = false
                    )`)
                }
            }
        }),
        this.clientsDashboard(adminId)
    ]);
        return [totalClients, totalProcess, totalStates, totalProcessState, clientes];
    }

    async clientsDashboard(adminId) {
        return Client.findAll({
            where: { id_user: adminId, active: true },
            attributes: ["id_client", "name", "nit", "price_month"],
            order: [["id_client", "DESC"]],
            limit: 5,
            raw: true
        });
    }
}

const dashboard = new Dashboard();
export default dashboard;
