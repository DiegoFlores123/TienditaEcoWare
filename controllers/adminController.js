const adminModel = require('../models/adminModel');

const getAllCustomers = (req, res) => {
    adminModel.getAllCustomers((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

const getAllProducts = (req, res) => {
    adminModel.getAllProducts((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, precio } = req.body;

    adminModel.updateProduct(id, nombre, cantidad, precio, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Product updated successfully!');
    });
};

const addProduct = (req, res) => {
    const { nombre, cantidad, precio } = req.body;

    adminModel.addProduct(nombre, cantidad, precio, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Product added successfully!');
    });
};

module.exports = { getAllCustomers, getAllProducts, updateProduct, addProduct };