import admin from "../config/firebase.js";
import { NotificationStrategy } from "./NotificationStrategy.js";

export class FCMStrategy extends NotificationStrategy {
    async send({ tokens, title, body }) {
        const result = await admin.messaging().sendEachForMulticast({
            tokens,
            notification: { title, body },
        });
        result.responses.forEach((r, i) => {
            if (!r.success)
                console.error(`[FCM] fallo token[${i}]:`, r.error?.code, r.error?.message);
        });
        return result;
    }
}
