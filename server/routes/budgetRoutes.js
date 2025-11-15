// // server/routes/budgetRoutes.js
// // const express = require("express");
// // const router = express.Router();
// // const auth = require("../middleware/authMiddleware");
// // const { getCurrentBudget, setBudget, getHistory } = require("../controllers/budgetController");

// import express from "express";
// import auth from "../middleware/authMiddleware.js";
// import { getCurrentBudget, setBudget, getHistory } from "../controllers/budgetController.js";

// const router = express.Router();

// router.get("/current", auth, getCurrentBudget);  // GET current month budget + spent + extra
// router.post("/set", auth, setBudget);            // POST { amount }
// router.get("/history", auth, getHistory);        // GET list of months with spent/extra

// export default router;

// server/routes/budgetRoutes.js
import express from "express";
import { getCurrentBudget } from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get current budget + extra spending
router.get("/current", authMiddleware, getCurrentBudget);

export default router;
