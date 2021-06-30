const express = require('express');
const mongoose = require('mongoose');

const path = require('path')
const bodyParser = require('body-parser');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120 // limite de 120 requêtes par windowMs
});

mongoose.connect('mongodb+srv://YannLcrx:qzoX5sfkx0Mc62cf@cluster0.td9cx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use(limiter);

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;