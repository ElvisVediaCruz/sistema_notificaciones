export class NotificationStrategy {
    async send({ tokens, title, body }) {
        throw new Error("send() debe ser implementado por la estrategia concreta");
    }
}
