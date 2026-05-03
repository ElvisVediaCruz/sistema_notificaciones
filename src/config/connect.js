import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_URL,
    {
        dialect: "mysql",
        logging: false
    }
);

export default sequelize;