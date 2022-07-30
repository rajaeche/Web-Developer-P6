
// objets router
const express = require('express');
const router = express.Router();

// middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// controllers sauce
const sauceCtrl = require('../controllers/sauce');


// routes
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getSingleSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.editSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislike);


module.exports = router;