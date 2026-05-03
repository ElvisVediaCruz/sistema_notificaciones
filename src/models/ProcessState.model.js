import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class ProcessState extends Model{};

ProcessState.init(
    {
        id_procces_state:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },{
        sequelize,
        modelName: "Process_state",
        tableName: "processtates"
    }
)

export default ProcessState;