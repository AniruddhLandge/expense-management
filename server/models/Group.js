// server/models/Group.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Group = sequelize.define("Group", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  members: {
    type: DataTypes.JSON, 
    allowNull: false,
  },
},
  {
    tableName: "Groups",     
    freezeTableName: true,  
    timestamps: true,
  }
);

export default Group;

