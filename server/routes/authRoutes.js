// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');


import express from 'express';
// import router from express.Router();
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
