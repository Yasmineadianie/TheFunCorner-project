const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index.controller')

router.get('/', indexController.openHome);


router.get('/about', indexController.openAbout);



module.exports = router;















