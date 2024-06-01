document.addEventListener('DOMContentLoaded', () => {
    const loadOrders = () => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(facturas => {
            if (!Array.isArray(facturas)) {
                throw new Error("Facturas no es un array");
            }

            const ordersList = document.getElementById('ordersList');
            ordersList.innerHTML = '';

            const facturasAgrupadas = facturas.reduce((acc, factura) => {
                const facturaId = factura.facturaId;
                if (!acc[facturaId]) {
                    acc[facturaId] = {
                        fecha: factura.fecha,
                        total: factura.total,
                        clienteId: factura.clienteId,
                        productos: []
                    };
                }
                acc[facturaId].productos.push({
                    productoNombre: factura.productoNombre,
                    cantidad: factura.cantidad,
                    precioVenta: factura.precioVenta
                });
                return acc;
            }, {});

            const facturasArray = Object.values(facturasAgrupadas);

            facturasArray.forEach(factura => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-item');

                const productosHtml = factura.productos.map(producto => `
                    <li>${producto.productoNombre} - ${producto.cantidad} unidades - ${producto.precioVenta} $</li>
                `).join('');

                orderDiv.innerHTML = `
                    <h3>Fecha: ${new Date(factura.fecha).toLocaleString()}</h3>
                    <h3>Total: ${factura.total} $</h3>
                    <p>Cliente ID: ${factura.clienteId}</p>
                    <ul>${productosHtml}</ul>
                `;
                ordersList.appendChild(orderDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    if (localStorage.getItem('token')) {
        loadOrders();
    }
});