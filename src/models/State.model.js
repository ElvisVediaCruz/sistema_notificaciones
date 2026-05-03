import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class State extends Model {}

State.init(
    {
        id_state: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "State",
        tableName: "states",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "id_user"]
            }
        ]
    }
);

export default State;
