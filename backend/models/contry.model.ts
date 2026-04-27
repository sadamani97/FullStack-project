import {DataTypes} from "sequelize";
import sequelize from "../config/db.js";



export const Country = sequelize.define("Country", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING(5), allowNull: false },
  population: { type: DataTypes.BIGINT, allowNull: false },
  flag: { type: DataTypes.STRING, allowNull: true },
  region: { type: DataTypes.STRING, allowNull: true },
  capital: { type: DataTypes.STRING, allowNull: true },
  states: { type: DataTypes.JSON, allowNull: true },
});
