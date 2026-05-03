import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class GroupMember extends Model {}

GroupMember.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "GroupMember",
        tableName: "group_members",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

export default GroupMember;
