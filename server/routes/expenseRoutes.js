// const express = require("express");
// const router = express.Router();
// const { addExpense, getUserExpenses } = require("../controllers/expenseController");
// const authMiddleware = require("../middleware/authMiddleware");

import express from "express";
import { addExpense, getUserExpenses } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add expense
router.post("/", authMiddleware, addExpense);

// Get all expenses of logged in user
router.get("/", authMiddleware, getUserExpenses);

export default router;
