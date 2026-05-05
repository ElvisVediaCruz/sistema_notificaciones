import { FCMStrategy } from "../notifications/FCMStrategy.js";

export class NotificationService {
    constructor(strategy = new FCMStrategy()) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async send({ tokens, title, body }) {
        if (tokens.length === 0) {
            console.warn("[Notification] sin tokens, notificación omitida");
            return { successCount: 0, failureCount: 0, responses: [] };
        }
        const result = await this.strategy.send({ tokens, title, body });
        console.log(`[Notification] exitosos=${result.successCount} fallidos=${result.failureCount}`);
        return result;
    }
}

export const notificationService = new NotificationService();
