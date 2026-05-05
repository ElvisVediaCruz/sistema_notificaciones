import Client from "../models/Clients.model.js";
import Process from "../models/Process.model.js";
import State from "../models/State.model.js";
import ProcessState from "../models/ProcessState.model.js";
import { Op, Sequelize } from "sequelize";

class Dashboard {
    async getDashboard(adminId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setUTCDate(today.getUTCDate() + 7);

        const todayStr = today.toISOString().split("T")[0];
        const sevenDaysLaterStr = sevenDaysLater.toISOString().split("T")[0];

        const [
            totalClients,
            totalActiveProcesses,
            totalStates,
            totalInactiveProcessStates,
            recentClients,
            dueToday,
            monthlyIncome,
            upcomingProcesses,
        ] = await Promise.all([
            Client.count({ where: { id_user: adminId, active: true } }),
            Process.count({
                distinct: true,
                col: "id_process",
                where: {
                    active: true,
                    id_process: {
                        [Op.notIn]: Sequelize.literal(`(SELECT DISTINCT id_process FROM processtates WHERE active = false)`),
                    },
                },
                include: [{ model: Client, where: { id_user: adminId, active: true }, attributes: [] }],
            }),
            State.count({ where: { id_user: adminId } }),
            Process.count({
                distinct: true,
                col: "id_process",
                where: {
                    active: true,
                    id_process: {
                        [Op.in]: Sequelize.literal(`(SELECT DISTINCT id_process FROM processtates WHERE active = false)`),
                    },
                },
                include: [{ model: Client, where: { id_user: adminId, active: true }, attributes: [] }],
            }),
            this.clientsDashboard(adminId),
            Process.count({
                where: { active: true, time_process: todayStr },
                include: [{ model: Client, where: { id_user: adminId, active: true }, attributes: [] }],
            }),
            Client.sum("price_month", { where: { id_user: adminId, active: true } }),
            Process.findAll({
                where: {
                    active: true,
                    time_process: { [Op.between]: [todayStr, sevenDaysLaterStr] },
                    id_process: {
                        [Op.in]: Sequelize.literal(`(
                            SELECT DISTINCT id_process FROM processtates WHERE active = false
                        )`),
                    },
                },
                include: [{ model: Client, where: { id_user: adminId, active: true }, attributes: ["id_client", "name"] }],
                attributes: ["id_process", "name", "time_process"],
                order: [["time_process", "ASC"]],
            }),
        ]);

        return {
            totalClients,
            totalActiveProcesses,
            totalStates,
            totalInactiveProcessStates,
            recentClients,
            dueToday,
            monthlyIncome: monthlyIncome ?? 0,
            upcomingProcesses,
        };
    }

    async clientsDashboard(adminId) {
        return Client.findAll({
            where: { id_user: adminId, active: true },
            attributes: ["id_client", "name", "nit", "price_month"],
            order: [["id_client", "DESC"]],
            limit: 5,
            raw: true,
        });
    }
}

const dashboard = new Dashboard();
export default dashboard;
