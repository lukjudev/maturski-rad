const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database/db');
const bodyParser = require('body-parser');

const authController = require('./controllers/AuthController');
const userController = require('./controllers/UserController');
const apartmentController = require('./controllers/ApartmentController');

require('dotenv').config();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cors({
    origin: '*'
}));

//Povezivanje sa bazom
db();

app.use('/api/auth', authController);
app.use('/api/user', userController);
app.use('/api/apartment', apartmentController);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server sluša na portu ${process.env.PORT || 3000}...`)
})