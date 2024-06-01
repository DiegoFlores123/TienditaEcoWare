const db = require('../database/db');

const getUserOrdersWithProducts = (clienteId, callback) => {
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
            return callback(err);
        }
        console.log('Resultados de la consulta:', results); 
        callback(null, results || []);
    });
};

const createOrder = (clienteId, total, productos, callback) => {
    db.query('INSERT INTO facturas (fecha, total, clienteId) VALUES (NOW(), ?, ?)', [total, clienteId], (err, results) => {
        if (err) return callback(err);

        const facturaId = results.insertId;
        productos.forEach(producto => {
            db.query('INSERT INTO productos_factura (cantidad, precioVenta, producto, facturaId, clienteId) VALUES (?, ?, ?, ?, ?)', 
                [producto.cantidad, producto.precioVenta, producto.nombre, facturaId, clienteId]);
        });

        callback(null, results);
    });
};

module.exports = { getUserOrdersWithProducts, createOrder };
