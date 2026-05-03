import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class Group extends Model {}

Group.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Group",
        tableName: "groups",
        timestamps: false
    }
);

export default Group;
