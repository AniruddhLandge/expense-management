// server/controllers/groupController.js
import Group from "../models/Group.js";
import GroupExpense from "../models/GroupExpense.js";
import { Sequelize } from "sequelize";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await Group.create({ name, members });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      attributes: [
        "id",
        "name",
        "members",
        // ✅ Calculate totalSpent for each group using SUM
        [
          Sequelize.literal(`(
            SELECT COALESCE(SUM(amount), 0)
            FROM GroupExpenses
            WHERE GroupExpenses.groupId = Group.id
          )`),
          "totalSpent"
        ]
      ]
    });
    
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

export const addGroupExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, amount, category } = req.body;

      if (!title || !amount || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Add expense
    const expense = await GroupExpense.create({
      groupId,
      title,
      amount,
      category,
    });

    res.json({ message: "Expense Added Successfully", expense });
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    // ✅ Find Group (so we can send group name)
    const group = await Group.findOne({
      where: { id: groupId }
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // ✅ Get all expenses of that group
    const expensesList = await GroupExpense.findAll({
      where: { groupId },
      order: [["createdAt", "DESC"]],
    });

    // ✅ Calculate total spent
    const totalAmount = expensesList.reduce((sum, exp) => sum + exp.amount, 0);

    // ✅ Send Proper Response
    res.json({
      groupName: group.name,  // <-- ye important h
      totalSpent: totalAmount,
      expenses: expensesList
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

