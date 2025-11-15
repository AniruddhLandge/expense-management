// const { DataTypes, Model } = require('sequelize');
// const sequelize = require('../config/db');
// const bcrypt = require('bcrypt');

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";


class User extends Model {
  async validPassword(raw) {
    return await bcrypt.compare(raw, this.password);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    monthlyLimit: { type: DataTypes.FLOAT, defaultValue: 0 },

    // 👇 new column for tracking monthly limit change
    lastLimitUpdate: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    modelName: "User",
  tableName: "users", 
  }
);

// Hash password before create
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Hash password before update (if password changed)
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export default User;
