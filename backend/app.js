
// package express
const express = require('express');

// package mongoose
const mongoose = require('mongoose');

// les routes
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const path = require('path');

// config du fichier .env
const dotenv = require("dotenv");
dotenv.config();


// variables d'environnement
const MY_USERNAME = process.env.DB_USERNAME;
const MY_PASSWORD = process.env.DB_PASSWORD;
const MY_CLUSTER = process.env.DB_CLUSTER;

// base données mongodb
mongoose.connect(`mongodb+srv://${MY_USERNAME}:${MY_PASSWORD}@${MY_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



const app = express();


  // gérer le CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
  

// express.json pour analyser le corps de la requête
app.use(express.json());

// routes 
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


// exporter les fichier app.js
module.exports = app;