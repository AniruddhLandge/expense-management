// // const { Sequelize, DataTypes } = require("sequelize");
// // const sequelize = require("../config/db");

// import { Sequelize } from "sequelize";
// import sequelize from "../config/db.js";

// const db = {};
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// // Import models
// db.User = require("./User")(sequelize, DataTypes);
// db.Expense = require("./Expense")(sequelize, DataTypes);
// db.Budget = require("./Budget")(sequelize, DataTypes);
// db.ExtraSpend = require("./ExtraSpend")(sequelize, DataTypes);

// // Associations
// db.User.hasMany(db.Expense, { foreignKey: "userId", onDelete: "CASCADE" });
// db.Expense.belongsTo(db.User, { foreignKey: "userId" });

// db.User.hasMany(db.Budget, { foreignKey: "userId", onDelete: "CASCADE" });
// db.Budget.belongsTo(db.User, { foreignKey: "userId" });

// db.User.hasMany(db.ExtraSpend, { foreignKey: "userId", onDelete: "CASCADE" });
// db.ExtraSpend.belongsTo(db.User, { foreignKey: "userId" });

// export default db;


import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";

// Import models
import User from "./User.js";
import Expense from "./Expense.js";
import Budget from "./Budget.js";
import ExtraSpend from "./ExtraSpend.js";

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.User = User;
db.Expense = Expense;
db.Budget = Budget;
db.ExtraSpend = ExtraSpend;

// Associations
db.User.hasMany(db.Expense, { foreignKey: "userId", onDelete: "CASCADE" });
db.Expense.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Budget, { foreignKey: "userId", onDelete: "CASCADE" });
db.Budget.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.ExtraSpend, { foreignKey: "userId", onDelete: "CASCADE" });
db.ExtraSpend.belongsTo(db.User, { foreignKey: "userId" });

export default db;

