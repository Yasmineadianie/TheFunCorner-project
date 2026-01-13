const express = require('express');
const uploadImg = require('../middlewares/uploadImg')

const playersController = require('../controllers/players.controller');

const router = express.Router();



/* GET users listing. */

//http://localhost:4009/players
router.get('/', playersController.openPlayers);

//http://localhost:4009/players/register

router.get('/register', playersController.openRegister);


router.post('/register', playersController.register);

//nos lleva al perfil de un player
router.get('/unPlayer/:id', playersController.openUnPlayer);

//nos abre el formulario para editar un player
router.get('/editPlayer/:id', playersController.openEditPlayer);

router.post('/editPlayer/:id', uploadImg("players"), playersController.editPplayer );


router.get('/login', playersController.openLogin);
router.post('/login', playersController.login)


router.get('/delTotal/:player_id', playersController.delTotal);
router.get('/delLogic/:player_id', playersController.delLogic)





module.exports = router;
