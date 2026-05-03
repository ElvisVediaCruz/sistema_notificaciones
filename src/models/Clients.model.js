import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/connect.js";

class Client extends Model{};

Client.init(
    {
        id_client: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        //analizar como se trabajara con el precio
        price_month: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        price_year: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{
        sequelize,
        modelName: "Client",
        tableName: "clients",
        timestamps: false
    }
);


export default Client;