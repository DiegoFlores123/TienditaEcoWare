const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', (req, res, next) => {
    authController.register(req, res);
});

router.post('/login', (req, res, next) => {
    authController.login(req, res);
});

module.exports = router;
