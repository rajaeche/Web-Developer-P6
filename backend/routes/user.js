const express = require('express');

// objet router 
const router = express.Router();
const userCtrl = require('../controllers/user');


// requêtes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;