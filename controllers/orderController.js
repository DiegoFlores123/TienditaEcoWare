const db = require('../database/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function createOrder(req, res) {
    const productos = req.body.productos;

    if (!Array.isArray(productos)) {
        return res.status(400).json({ error: "Items must be an array" });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const clienteId = decoded.id;

        db.beginTransaction(err => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ error: 'Failed to start transaction' });
            }

            db.query('SELECT id FROM clientes WHERE id = ?', [clienteId], (err, clienteRows) => {
                if (err) {
                    console.error('Error querying client:', err);
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Failed to query client' });
                    });
                }

                if (clienteRows.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ error: `Cliente con id ${clienteId} no encontrado` });
                    });
                }

                let total = 0;

                db.query('INSERT INTO facturas (clienteId, fecha, total) VALUES (?, NOW(), 0)', [clienteId], (err, result) => {
                    if (err) {
                        console.error('Error inserting factura:', err);
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Failed to insert factura' });
                        });
                    }

                    const facturaId = result.insertId;

                    let productUpdates = productos.map(producto => {
                        return new Promise((resolve, reject) => {
                            db.query('SELECT nombre, precio FROM productos WHERE id = ?', [producto.id], (err, rows) => {
                                if (err) return reject(err);
                                if (rows.length === 0) return reject(new Error(`Producto con id ${producto.id} no encontrado`));

                                const nombre = rows[0].nombre;
                                const precio = rows[0].precio;
                                total += precio * producto.cantidad;

                                db.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?', [producto.cantidad, producto.id], (err) => {
                                    if (err) return reject(err);

                                    db.query('INSERT INTO productos_factura (cantidad, precioVenta, producto, facturaId, clienteId) VALUES (?, ?, ?, ?, ?)', 
                                        [producto.cantidad, precio, nombre, facturaId, clienteId], (err) => {
                                            if (err) return reject(err);
                                            resolve();
                                        });
                                });
                            });
                        });
                    });

                    Promise.all(productUpdates).then(() => {
                        db.query('UPDATE facturas SET total = ? WHERE id = ?', [total, facturaId], (err) => {
                            if (err) {
                                console.error('Error updating factura total:', err);
                                return db.rollback(() => {
                                    res.status(500).json({ error: 'Failed to update factura total' });
                                });
                            }

                            db.commit(err => {
                                if (err) {
                                    console.error('Error committing transaction:', err);
                                    return db.rollback(() => {
                                        res.status(500).json({ error: 'Failed to commit transaction' });
                                    });
                                }

                                res.status(200).json({ message: 'La orden se hizo exitosamente y la factura se creó.' });
                            });
                        });
                    }).catch(err => {
                        console.error('Error processing products:', err);
                        db.rollback(() => {
                            res.status(500).json({ error: 'Failed to process products' });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Ocurrió un error al hacer la orden.' });
    }
}

const getUserOrders = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const clienteId = decoded.id;

    const query = `
        SELECT 
            f.id AS facturaId, 
            f.fecha, 
            f.total, 
            f.clienteId,
            pf.cantidad, 
            pf.precioVenta, 
            pf.producto AS productoNombre
        FROM 
            facturas f
        LEFT JOIN 
            productos_factura pf ON f.id = pf.facturaId
        WHERE 
            f.clienteId = ?
        ORDER BY 
            f.fecha DESC;
    `;

    console.log('Executing query:', query); 
    db.query(query, [clienteId], (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).send(err);
        }
        console.log('Resultados de la consulta:', results); 
        res.json(results || []);
    });
};

module.exports = { createOrder, getUserOrders };
