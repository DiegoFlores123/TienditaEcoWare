const express = require('express');
const orderController = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.post('/', authenticateJWT.Cliente, (req, res, next) => {
    orderController.createOrder(req, res);
});

router.get('/', authenticateJWT.Cliente, (req, res, next) => {
    orderController.getUserOrders(req, res);
});

module.exports = router;
