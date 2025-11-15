import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { Op } from "sequelize";

// const express = require ("express");
// const authMiddleware = require ("../middleware/authMiddleware.js");
// const User =require("../models/User.js");
// const Expense = require ("../models/Expense.js");

const router = express.Router();

// Get user + current month spent
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // ✅ Sequelize method
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyExpenses = await Expense.findAll({
      where: {
        userId: req.user.id,
        date: { [Op.between]: [startOfMonth, endOfMonth] }
      }
    });

    const currentMonthSpent = monthlyExpenses.reduce(
      (acc, exp) => acc + exp.amount,
      0
    );

    res.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      monthlyLimit: user.monthlyLimit,
      lastLimitUpdate: user.lastLimitUpdate,
      currentMonthSpent
    });
  } catch (err) {
    console.error("🔥 Error in /me:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update monthly limit (only once per month)
router.put("/update-limit", authMiddleware, async (req, res) => {
  try {
    const { monthlyLimit } = req.body;
    const user = await User.findByPk(req.user.id); // ✅ Sequelize method
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (
      user.lastLimitUpdate &&
      user.lastLimitUpdate.getMonth() === currentMonth &&
      user.lastLimitUpdate.getFullYear() === currentYear
    ) {
      return res.status(400).json({ error: "You can change the limit only once per month." });
    }

    user.monthlyLimit = monthlyLimit;
    user.lastLimitUpdate = now;

    await user.save();

    res.json({
      message: "Monthly limit updated successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        monthlyLimit: user.monthlyLimit,
        lastLimitUpdate: user.lastLimitUpdate
      }
    });
  } catch (err) {
    console.error("🔥 Error in /update-limit:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
