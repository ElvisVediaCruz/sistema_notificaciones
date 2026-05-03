import dotenv from "dotenv";
import "dotenv/config";
dotenv.config();

import express from "express";
import db from "./models/index.js";
import cors from "cors";

import authRouter      from "./routes/auth.routes.js";
import groupRouter     from "./routes/group.routes.js";
import clientsRouter   from "./routes/clients.routes.js";
import processRouter   from "./routes/process.routes.js";
import statesRouter    from "./routes/states.routes.js";
import prosStateRouter from "./routes/procesState.route.js";
import dashboardRouter from "./routes/dashboard.js";
import { startProcessJob, startProcessJobUpdate } from "./jobs/Process.job.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use((req, res, next) => {
    res.ok = (data) => res.status(200).json(data);
    res.created = (data) => res.status(201).json(data);
    res.noContent = () => res.status(204).send();            // DELETE
    res.badRequest = (msg) => res.status(400).json({ message: msg });
    res.unauthorized = (msg) => res.status(401).json({ message: msg });
    res.forbidden = (msg) => res.status(403).json({ message: msg });
    res.notFound = (msg) => res.status(404).json({ message: msg });
    res.serverError = (msg) => res.status(500).json({ message: msg });
    next();
});

app.use("/api/auth",      authRouter);
app.use("/api/groups",   groupRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/clients",  clientsRouter);
app.use("/api/process",  processRouter);
app.use("/api/states",   statesRouter);
app.use("/api/proStates", prosStateRouter);


app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "JSON inválido" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
});



async function start() {
    try {
        await db.sequelize.authenticate();
        //alter"modifica la tabla"---force"modifica las tablas eliminando los datos"
        await db.sequelize.sync({ alter: true });
        app.listen(process.env.PORT || 3000 , () => {
            console.log("http://localhost:", process.env.PORT_SERVER);
        });
        startProcessJob();
        startProcessJobUpdate();
    } catch (error) {
        console.error("Error:", error);
    }
}
start();

