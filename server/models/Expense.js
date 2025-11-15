// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Expense = sequelize.define(
  "Expense",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "expenses", // 👈 तेरे MySQL वाले नाम से match कर दिया
    timestamps: false,     // createdAt / updatedAt हटा दिए
  }
);

export default Expense;
