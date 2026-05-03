import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class Process extends Model{};

Process.init(
    {
        id_process: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        },
        time_process: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: true
            }
        },
        notified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        notified_due: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        day_alert: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 31 }
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{
        sequelize,
        modelName: "Process",
        tableName: "process",
        timestamps: false
    }
);


export default Process;