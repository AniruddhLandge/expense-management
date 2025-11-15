import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Budget extends Model {}

Budget.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    month: { type: DataTypes.STRING, allowNull: false }, // "YYYY-MM"
    limitAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    changesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "budget" }
);

export default Budget;
