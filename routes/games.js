const express = require('express');
const gamesController = require('../controllers/games.controller')
const uploadImg = require('../middlewares/uploadImg')


const router = express.Router();


router.get('/openFormAddGame/:player_id', gamesController.openFormNewGame);



router.post("/addGame/:player_id", uploadImg("games"), gamesController.addGame);

router.get("/addNewGameSelect", gamesController.openAddNewGameSelect);

router.post("/addNewGameSelect", uploadImg("games"), gamesController.addNewGameSelect);

router.get("/editGame/:game_id", gamesController.openEditGame)


router.post("/editGame/:game_id/:player_id", uploadImg("games"), gamesController.editToGame)


router.get ("/delGame/:game_id/:player_id", gamesController.delGame)

router.get ("/deactivateGame/:game_id/:player_id", gamesController.deactivateGame)








module.exports = router;

