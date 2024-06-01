const db = require('../database/db');

const getAllCustomers = callback => {
    db.query('SELECT * FROM clientes', callback);
};

const getAllProducts = callback => {
    db.query('SELECT * FROM productos', callback);
};

const updateProduct = (id, nombre, cantidad, precio, callback) => {
    db.query('UPDATE productos SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?', [nombre, cantidad, precio, id], callback);
};

const addProduct = (nombre, cantidad, precio, callback) => {
    db.query('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)', [nombre, cantidad, precio], callback);
};

module.exports = { getAllCustomers, getAllProducts, updateProduct, addProduct };