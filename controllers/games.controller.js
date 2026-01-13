const connection = require("../config/db")

class GamesController{


openFormNewGame = (req, res)=>{

const {player_id} = req.params;



  res.render('formAddGame', {message: "", player_id: player_id});
}


addGame = (req, res)=>{
  const {player_id} = req.params;
const {title, review, starrating, platform, year_release} = req.body;

  
if(!title||!review||!starrating||!platform||!year_release){

 res.render("formAddGame", {message: "All fields are required!", player_id:player_id})

}else if(!req.file){
  res.render("formAddGame", {message: "A photo is required", player_id:player_id})

}else{
                                         
  let sql = `INSERT  INTO game (player_id, title, review, starrating, platform, year_release, game_img)
  VALUES (?,?,?,?,?,?,?)`  
  let values = [player_id, title, review, starrating, platform, year_release, req.file.filename]                                       
connection.query(sql, values, (err, result)=>{
  if(err){
    throw err;
  }else{

   
    res.redirect(`/players/unPlayer/${player_id}`)
  }
})

}

}


//muestra el form addgame
openAddNewGameSelect = (req, res)=>{
  //lista players
  let sql = 'SELECT player_id, name, last_name FROM player WHERE player_is_del = 0'
  connection.query(sql, (err, result)=>{
    if(err){
      throw err;
    }else{
      res.render("addGameSelect", {players: result, message:""})
    }
  })
  
}


addNewGameSelect = (req, res)=>{
  const {player_id, title, review, starrating, platform, year_release} = req.body;

 if(!player_id||!title||!review||!starrating||!platform||!year_release||!req.body){
  let sql = 'SELECT player_id, name, last_name FROM player WHERE player_is_del = 0'
  connection.query(sql, (err, result)=>{
    if(err){
      throw err;
    }else{
      res.render("addGameSelect", {players:result, message: "All fields are required!"})
    }
  })

 }else{
  let sql = 'INSERT INTO game (player_id, title, review, starrating, platform, year_release, game_img) VALUES(?,?,?,?,?,?,?)'

  let values = [player_id, title, review, starrating, platform, year_release, req.file.filename]
  connection.query(sql, values, (err, result)=>{
    if(err){
      throw err;
    }else{
      res.redirect(`/players/unPlayer/${player_id}`)         
    }
  })
}
 }
   

//abre el form de gameedit
openEditGame = (req, res)=>{
  const {game_id} = req.params                          
  let sql = 'SELECT * FROM  game WHERE game_id = ?'
  let values = [game_id];
  connection.query(sql, values, (err, result)=>{
    if(err){
      throw err
    }else{

      console.log("resulttttt");
      res.render("editGame", {gameToEdit: result[0], message: ""})
    }
  })
  
}


editToGame = (req, res)=>{
  const {title, review, starrating, platform, year_release} = req.body;
  const {game_id, player_id} = req.params;                    
  
  if(!title||!review||!starrating||!platform||!year_release||!req.file){

       //validacion

 res.send("missing data")
  }else{
    let sql = 'UPDATE game SET title = ?, review = ?, starrating = ?, platform = ?, year_release = ?, game_img = ? WHERE game_id = ?'
    let values = [title, review, starrating, platform, year_release, req.file.filename, game_id]
    connection.query(sql, values, (err, result)=>{
      if(err){
        throw err
      }else{                                                        
        res.redirect(`/players/unPlayer/${player_id}`)
      }
    })
  }   
  
}


delGame = (req, res)=>{
                                              
const {game_id, player_id} = req.params;
  let sql = 'DELETE FROM  game WHERE game_id = ?'
  connection.query(sql, [game_id], (err, result)=>{
    if(err){
      throw err;
    }else{
      res.redirect(`/players/unPlayer/${player_id}`)
    }
  })
}



deactivateGame = (req, res)=>{
                                              
const {game_id, player_id} = req.params;
  let sql = 'UPDATE  game SET game_is_del = 1 WHERE game_id = ?'
  connection.query(sql, [game_id], (err, result)=>{
    if(err){
      throw err;
    }else{
      res.redirect(`/players/unPlayer/${player_id}`)
    }
  })
}













}

module.exports = new GamesController();