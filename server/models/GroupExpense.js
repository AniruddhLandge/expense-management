import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Group from "./Group.js";

const GroupExpense = sequelize.define("GroupExpense", {
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
    allowNull: true,
  },
});

// ✅ GroupExpense belongs to Group
GroupExpense.belongsTo(Group, { foreignKey: "groupId", onDelete: "CASCADE" });

export default GroupExpense;
