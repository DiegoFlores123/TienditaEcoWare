const loadCart = () => {
    const cartItems = document.getElementById('cartItems');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.innerHTML = '';
    cart.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${product.nombre} - ${product.precio} $ (x${product.cantidad})</p>
            <button onclick="updateQuantity(${product.id}, 1)">+</button>
            <button onclick="updateQuantity(${product.id}, -1)">-</button>
            <button onclick="removeFromCart(${product.id})">Eliminar</button>
        `;
        cartItems.appendChild(div);
    });
};

const updateQuantity = (id, change) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === id);
    if (product) {
        product.cantidad += change;
        if (product.cantidad <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};

const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
};

const showMessage = (message, type = 'info') => {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.classList.remove('error', 'success', 'info');
    messageBox.classList.add(type);
    setTimeout(() => {
        messageBox.textContent = '';
    }, 3000);
};

const checkout = () => {
    const token = localStorage.getItem('token');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart);

    if (!Array.isArray(cart)) {
        cart = [cart];
    }

    fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productos: cart })
    }).then(response => response.json()).then(data => {
        showMessage(data.message, 'success');
        localStorage.removeItem('cart');
        loadCart();
    }).catch(error => {
        console.error('Error:', error);
        showMessage('Hubo un error al realizar el checkout. Inténtalo de nuevo.', 'error');
    });
};


document.addEventListener('DOMContentLoaded', loadCart);