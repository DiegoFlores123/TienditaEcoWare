document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const nombre = document.getElementById('registerNombre').value;
            const direccion = document.getElementById('registerDireccion').value;

            fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, tipo: 2, nombre, direccion })
            }).then(response => response.text()).then(data => {
                document.getElementById('reg1').innerHTML = "Registrando cuenta..."
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            });
        });
    }

    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }).then(response => response.json()).then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    document.getElementById('reg').innerHTML = "Iniciando sesion..."
                    clearCart();
                    setTimeout(() => {
                        window.location.href = 'products.html';  
                    }, 2000);
                } else {
                    document.getElementById('reg').innerHTML = "Sesion fallida..."
                }
            });
        });
    }
});

const clearCart = () => {
    localStorage.removeItem('cart');
};