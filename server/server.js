// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const sequelize = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const expenseRoutes = require("./routes/expenseRoutes");
// // const userRoutes = require("./routes/userRoutes")
// import userRoutes from "./routes/userRoutes.js";


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

// app.use("/api/user", userRoutes);
dotenv.config();
const app = express();

// ✅ CORS setup – multiple origins allow
app.use(
  cors({
    origin: [
      "http://localhost:3000", // frontend dev
       "https://expense-management-production-f150.up.railway.app",
      "https://your-frontend-domain.com", // frontend prod (future)
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/groups", groupRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on server!" });
});

const PORT = process.env.PORT || 5000;

// ✅ Start server with DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    //  await sequelize.sync({ alter: true }); // { alter: true }  // dev only
    // console.log("✅ Database synced!");
     
    sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synced"))
  .catch(err => console.log(err));

    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)   
    );
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
})();
