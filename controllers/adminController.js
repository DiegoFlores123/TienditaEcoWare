const db = require('../database/db');

const getAllCustomers = (req, res) => {
    db.query('SELECT * FROM clientes WHERE nombre != ""', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

const getAllProducts = (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, precio } = req.body;

    db.query('UPDATE productos SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?', [nombre, cantidad, precio, id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Product updated successfully!');
    });
};

const addProduct = (req, res) => {
    const { nombre, cantidad, precio } = req.body;

    db.query('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)', [nombre, cantidad, precio], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Product added successfully!');
    });
};

module.exports = { getAllCustomers, getAllProducts, updateProduct, addProduct };
