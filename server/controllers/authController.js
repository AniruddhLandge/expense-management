// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const register = async (req, res) => {
  const { name, email, password, monthlyLimit } = req.body;
  try {
    const user = await User.create({ name, email, password, monthlyLimit });
    const token = jwt.sign({ id: user.id,name: user.name, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "30d"
    });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email,monthlyLimit: user.monthlyLimit } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    console.log("🔍 Login request email:", email);
console.log("🔍 User found:", user ? user.toJSON() : null);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await user.validPassword(password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id,name: user.name, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email,monthlyLimit: user.monthlyLimit } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
