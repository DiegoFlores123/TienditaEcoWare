const db = require('../database/db');

const getAllProducts = callback => {
    db.query('SELECT * FROM productos', callback);
};

const searchProductsByName = (name, callback) => {
    const query = 'SELECT * FROM productos WHERE nombre LIKE ?';
    db.query(query, [`%${name}%`], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = { getAllProducts, searchProductsByName };
