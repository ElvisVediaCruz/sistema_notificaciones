import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class User extends Model {};

User.init(
    {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM("administrador", "usuario"),
            allowNull: false,
            defaultValue: "usuario"
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fcm_token: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },{
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false
    }
);

export default User;