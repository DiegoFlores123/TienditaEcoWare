const orderModel = require('../models/orderModel');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createOrder(req, res) {
    const productos = req.body.productos;

    if (!Array.isArray(productos)) {
        return res.status(400).json({ error: "Items must be an array" });
    }

    let connection;

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const clienteId = decoded.id;

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await connection.beginTransaction();

        const [clienteRows] = await connection.execute('SELECT id FROM clientes WHERE id = ?', [clienteId]);
        if (clienteRows.length === 0) {
            throw new Error(`Cliente con id ${clienteId} no encontrado`);
        }

        let total = 0;

        const [result] = await connection.execute('INSERT INTO facturas (clienteId, fecha, total) VALUES (?, NOW(), 0)', [clienteId]);
        const facturaId = result.insertId;

        for (const producto of productos) {
            const productId = producto.id;
            const cantidad = producto.cantidad;

            const [rows] = await connection.execute('SELECT nombre, precio FROM productos WHERE id = ?', [productId]);
            if (rows.length === 0) {
                throw new Error(`Producto con id ${productId} no encontrado`);
            }

            const nombre = rows[0].nombre;
            const precio = rows[0].precio;
            total += precio * cantidad;

            await connection.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?', [cantidad, productId]);
            
            await connection.query('INSERT INTO productos_factura (cantidad, precioVenta, producto, facturaId, clienteId) VALUES (?, ?, ?, ?, ?)', 
                [cantidad, precio, nombre, facturaId, clienteId]);
        }

        await connection.execute('UPDATE facturas SET total = ? WHERE id = ?', [total, facturaId]);

        await connection.commit();
        await connection.end();

        res.status(200).json({ message: 'La orden se hizo exitosamente y la factura se creó.' });

    } catch (error) {
        console.error('Error:', error);
        if (connection) {
            await connection.rollback();
            await connection.end();
        }
        res.status(500).json({ error: 'Ocurrió un error al hacer la orden.' });
    }
}


const getUserOrders = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const clienteId = decoded.id;

    orderModel.getUserOrdersWithProducts(clienteId, (err, results) => {
        if (err) {
            console.error('Error obteniendo las órdenes del usuario:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

module.exports = { createOrder, getUserOrders };
