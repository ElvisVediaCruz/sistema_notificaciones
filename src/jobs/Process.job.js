import cron from "node-cron";
import admin from "../config/firebase.js";
import Process from "../models/Process.model.js";
import Client from "../models/Clients.model.js";
import User from "../models/User.model.js";
import Group from "../models/Group.model.js";
import GroupMember from "../models/GroupMember.model.js";
import ProcessState from "../models/ProcessState.model.js";
import { advanceAlertDate } from "../functions/normalize.js";
import {updateDate} from "../services/Process.service.js"

async function getTokensForAdmin(adminId) {
    const adminUser = await User.findByPk(adminId, { attributes: ["fcm_token"] });
    const members = await GroupMember.findAll({
        include: [
            { model: Group, where: { admin_id: adminId }, attributes: [] },
            { model: User, as: "member", attributes: ["fcm_token"] },
        ],
    });
    return [
        adminUser?.fcm_token,
        ...members.map((m) => m.member?.fcm_token),
    ].filter(Boolean);
}

async function sendNotifications(processes, type) {
    const update = type === "warning_2" ? { notified: true } : { notified_due: true };
    for (const process of processes) {
        try {
            const adminId = process.Client.id_user;
            const tokens = await getTokensForAdmin(adminId);
            console.log(`[FCM] proceso=${process.id_process} tipo=${type} adminId=${adminId} tokens=${tokens.length}`, tokens);
            if (tokens.length === 0) {
                console.warn(`[FCM] sin tokens para adminId=${adminId}, notificación omitida`);
                await process.update(update);
                continue;
            }
            const notification =
                type === "warning_2"
                    ? { title: "Trámite próximo a vencer", body: `El trámite "${process.name}" vence en 2 días.` }
                    : { title: "Trámite próximo a vencer", body: `El trámite "${process.name}" vence mañana.` };

            const result = await admin.messaging().sendEachForMulticast({ tokens, notification });
            
            console.log(`[FCM] enviado: exitosos=${result.successCount} fallidos=${result.failureCount}`);
            result.responses.forEach((r, i) => {
                if (!r.success) console.error(`[FCM] fallo token[${i}]:`, r.error?.code, r.error?.message);
            });
            await process.update(update);
        } catch (err) {
            console.error(`[FCM] error proceso=${process.id_process} tipo=${type}:`, err.message);
        }
    }
}

async function advanceDueProcesses(processes) {
    for (const process of processes) {
        await ProcessState.update({ active: false }, { where: { id_process: process.id_process } });
        const newTimeProcess = advanceAlertDate(process.day_alert, process.time_process);
        await process.update({ time_process: newTimeProcess, notified: false, notified_due: false });
    }
}

function dateAhead(days) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split("T")[0];
}

function todayUTC() {
    return new Date().toISOString().split("T")[0];
}

async function runJob() {
    const today = todayUTC();
    const oneDayAhead = dateAhead(1);
    const twoDaysAhead = dateAhead(2);

    const [twoDayWarnings, oneDayWarnings, dueProcesses] = await Promise.all([
        Process.findAll({
            where: { time_process: twoDaysAhead, notified: false, active: true },
            include: [{ model: Client, attributes: ["id_user"], where: { active: true }, required: true }],
        }),
        Process.findAll({
            where: { time_process: oneDayAhead, notified_due: false, active: true },
            include: [{ model: Client, attributes: ["id_user"], where: { active: true }, required: true }],
        }),
        Process.findAll({
            where: { time_process: today },
        }),
    ]);
    await sendNotifications(twoDayWarnings, "warning_2");
    await sendNotifications(oneDayWarnings, "warning_1");
    await advanceDueProcesses(dueProcesses);
}

async function runJobUpdate() {
    const today = todayUTC();
    await updateDate(today)
}

export function startProcessJob() {
    let running = false;
    cron.schedule("* * * * *", () => {
        if (running) {
            console.warn("[CRON] runJob aún en ejecución, tick omitido");
            return;
        }
        running = true;
        runJob()
            .catch((err) => console.error("Error en job de notificaciones:", err))
            .finally(() => { running = false; });
    });
    console.log("Cron de notificaciones iniciado");
}

export function startProcessJobUpdate() {
    cron.schedule("5 1 * * *", () => {
        runJobUpdate().catch((err) => console.error("Error al actualizar los estados:", err));
    });
    console.log("Cron de actualización de estados iniciado");
}

export { runJob, runJobUpdate};
