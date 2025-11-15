// // server/controllers/budgetController.js
// // const { Budget, Expense } = require("../models");
// // import { Budget, Expense } from "../models";
// import Budget from "../models/Budget.js";
// import Expense from "../models/Expense.js";

// import { Op } from "sequelize";


// const getMonthKey = (d = new Date()) => d.toISOString().slice(0, 7); // "YYYY-MM"
// const monthRange = (monthKey) => {
//   const [y, m] = monthKey.split("-").map(Number);
//   const start = new Date(y, m - 1, 1);
//   const end = new Date(y, m, 1);
//   return { start, end };
// };

// export const getCurrentBudget = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const month = getMonthKey();
//     let budget = await Budget.findOne({ where: { userId, month } });
//     if (!budget) {
//       budget = await Budget.create({ userId, month, limitAmount: 0, changesCount: 0 });
//     }

//     const { start, end } = monthRange(month);
//     const spentRaw = await Expense.sum("amount", {
//       where: { userId, date: { [Op.gte]: start, [Op.lt]: end } },
//       // where: { userId, date: { $gte: start, $lt: end } }
//     });
//     const spent = Number(spentRaw || 0);
//     const limit = Number(budget.limitAmount || 0);
//     const extra = Math.max(0, spent - limit);
//     const eightyReached = limit > 0 && spent >= 0.8 * limit;
//     const overLimit = limit > 0 && spent > limit;

//     return res.json({
//       month,
//       limitAmount: limit,
//       spent,
//       extra,
//       changesCount: budget.changesCount,
//       eightyReached,
//       overLimit,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Failed to fetch current budget" });
//   }
// };

// export const setBudget = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { amount } = req.body;
//     if (amount == null || Number(amount) < 0) {
//       return res.status(400).json({ message: "Invalid amount" });
//     }
//     const month = getMonthKey();
//     let budget = await Budget.findOne({ where: { userId, month } });
//     if (!budget) {
//       budget = await Budget.create({ userId, month, limitAmount: amount, changesCount: 0 });
//       return res.json({ ok: true, limitAmount: Number(amount), changesCount: 0 });
//     }
//     // once-per-month change rule
//     const newVal = Number(amount);
//     const oldVal = Number(budget.limitAmount);
//     if (newVal !== oldVal) {
//       if (budget.changesCount >= 1) {
//         return res.status(403).json({ message: "You can change limit only once per month" });
//       }
//       budget.limitAmount = newVal;
//       budget.changesCount += 1;
//       await budget.save();
//     }
//     return res.json({ ok: true, limitAmount: Number(budget.limitAmount), changesCount: budget.changesCount });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Failed to set budget" });
//   }
// };

// export const getHistory = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const budgets = await Budget.findAll({ where: { userId }, order: [["month", "DESC"]] });

//     const data = [];
//     for (const b of budgets) {
//       const { start, end } = monthRange(b.month);
//       const sumRaw = await Expense.sum("amount", { where: { userId, date: { $gte: start, $lt: end } } });
//       const spent = Number(sumRaw || 0);
//       const limit = Number(b.limitAmount || 0);
//       data.push({
//         month: b.month,
//         limitAmount: limit,
//         spent,
//         extra: Math.max(0, spent - limit),
//         changesCount: b.changesCount,
//       });
//     }
//     res.json(data);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Failed to fetch history" });
//   }
// };


// server/controllers/budgetController.js
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { Op } from "sequelize";


const getMonthKey = (d = new Date()) => d.toISOString().slice(0, 7);

export const getCurrentBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId); // ✅ Sequelize method

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const monthKey = getMonthKey();

    // current month range
    const startDate = new Date(`${monthKey}-01`);
    const endDate = new Date(`${monthKey}-31`);

    const expenses = await Expense.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    const extra =
      totalSpent > user.monthlyLimit ? totalSpent - user.monthlyLimit : 0;

    return res.json({
      month: monthKey,
      monthlyLimit: user.monthlyLimit,
      totalSpent,
      extra,
    });
  } catch (err) {
    console.error("Budget fetch error:", err);
    res.status(500).json({ error: "Failed to fetch budget data" });
  }
};

