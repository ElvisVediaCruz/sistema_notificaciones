import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.USER_NAME,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: "mysql",
        logging: false
    }
);

export default sequelize;