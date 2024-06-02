const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const register = (req, res) => {
    const { email, password, tipo, nombre, direccion } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('CALL registrar_usuario(?, ?, ?, ?, ?)', [email, hashedPassword, tipo, nombre, direccion], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).send('Error registering user.');
        }
        if (tipo === 1) {
            db.query('INSERT INTO clientes (nombre) VALUES (?)', '', (err) => {
                if (err) {
                    console.error('Error registering admin as client:', err);
                    return res.status(500).send('Error registering admin as client.');
                }
                res.send('Admin registered successfully!');
            });
        } else {
            res.send('User registered successfully!');
        }
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('User not found');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.id, tipo: user.tipo }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
};

module.exports = { register, login };
