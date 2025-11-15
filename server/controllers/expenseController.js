// const Expense = require("../models/Expense");
import Expense from "../models/Expense.js";

// Add Expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      userId: req.user.id, // authMiddleware se aaya user
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

// Get all expenses of a user
export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [["date", "DESC"]],
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// module.exports = { addExpense, getUserExpenses };
