// server/routes/groupRoutes.js
import express from "express";
import { createGroup, getGroups, addGroupExpense, getGroupExpenses } from "../controllers/groupController.js";
import auth from "../middleware/authMiddleware.js";
import Group from "../models/Group.js"; // ✅ Static import

const router = express.Router();

// ✅ Group create
router.post("/", auth, createGroup);

// ✅ Fetch groups
router.get("/", auth, getGroups);

// ✅ Add expense to group
router.post("/:groupId/expenses", auth, addGroupExpense);

// ✅ Get group expenses
router.get("/:groupId/expenses", auth, getGroupExpenses);

// ✅ Delete Group
// ✅ Replace delete route with this
router.delete("/:groupId", auth, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const deleted = await Group.destroy({
      where: { id: groupId }, // ✅ Sequelize uses where clause
    });

    if (!deleted) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ message: "🗑️ Group deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error while deleting group" });
  }
});


export default router;
