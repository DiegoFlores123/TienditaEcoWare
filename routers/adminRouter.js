const express = require('express');
const adminController = require('../controllers/adminController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.get("/customers", authenticateJWT.Admin, (req, res, next) => {
    adminController.getAllCustomers(req, res);
});

router.get("/products", authenticateJWT.Admin, (req, res, next) => {
    adminController.getAllProducts(req, res);
});

router.put("/products/:id", authenticateJWT.Admin, (req, res, next) => {
    adminController.updateProduct(req, res);
});

router.post("/products", authenticateJWT.Admin, (req, res, next) => {
    adminController.addProduct(req, res);
});

module.exports = router;
