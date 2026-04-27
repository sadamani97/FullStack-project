import { Sequelize } from "sequelize";
const sequelize = new Sequelize("country_project", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});
export default sequelize;
//# sourceMappingURL=db.js.map