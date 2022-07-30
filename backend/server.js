//  importer le package HTTP natif
const http = require('http');

//  importer le fichier app
const app = require('./app');

// variables d'environnement
const dotenv = require("dotenv");
dotenv.config();


//  paramètres du port
app.set('port', process.env.PORT);


// createServer prends en argument les fonctions dans app.js
const server = http.createServer(app);


// le serveur écoute les requêtes sur le port 3000
server.listen(process.env.PORT,
    console.log(`écoute du port : ${process.env.PORT}`)
);



