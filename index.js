const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT;

const router = require('./routers/routes.js');
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server escuchando al puerto ${PORT}`);
});