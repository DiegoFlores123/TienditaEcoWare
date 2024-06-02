const db = require('../database/db');

const getProducts = (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

const searchProducts = (req, res) => {
    const productName = req.params.name;
    const query = 'SELECT * FROM productos WHERE nombre LIKE ?';
    db.query(query, [`%${productName}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

module.exports = { getProducts, searchProducts };
