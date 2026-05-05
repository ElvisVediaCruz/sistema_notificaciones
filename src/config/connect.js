import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_URL,
    {
        dialect: "mysql",
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 20000,
            idle: 10000,
        },
        dialectOptions: {
            connectTimeout: 10000,
        },
    }
);

export default sequelize;