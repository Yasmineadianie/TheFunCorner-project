const connection = require('../config/db');
const bcrypt = require('bcrypt');

class PlayersController{
    openPlayers = (req, res) => {                  
       
       let sql = `SELECT * FROM player WHERE player_is_del = 0`
       
       connection.query(sql, (err, result)=>{
        if(err){
            throw err
        }else{
console.log("playerssss", result);

       res.render('players', {data: result});     
        }
       })
                       
    }










    openRegister = (req, res)=>{
        res.render('register', {message: ""});
    }


register = (req, res)=>{         //el req.body trae los datos del formulario
console.log(req.body);


const {name, last_name, email, password, preferences} = req.body;

//validacion para no recibir datos vacios

if(!name||!last_name||!email||!password||!preferences){
    res.render("register", {message: "All fields are required!"});
}else{



//incriptamos con la funcion hash.(10 nªsalto)
    bcrypt.hash(password, 10, (err, hash)=>{
        if(err){
            throw err
        }else{
      
let sql = `INSERT INTO player (name, last_name, email, password, preferences) 
VALUES("${name}", "${last_name}", "${email}", "${hash}", "${preferences}")`

connection.query(sql, (err, result)=>{
    if(err){
         console.log("----", err.errno);                                  // el 1062 es el error de duplicacion de entrada
if(err.errno == 1062){                                                //controlamos un error
    res.render('register', {message: "this email already exist!"})
   }else{
   throw err
    }
     
    }else{

          res.redirect('/players')
    }
    
})


        }
    });

}
  
}





 openUnPlayer = (req, res) =>{
 const {id} = req.params
 //consultar parametrizadas. el [id] subtituye el 
 let sql = 'SELECT * FROM player WHERE player_id = ?'
 let values = [id]
 connection.query(sql, values, (err, result)=>{
  if(err){
     throw err
  }else{  
     //console.log("resultt unPlayer", result)
     //se pone el result[0] para que le llegue a la vista un objecto
       let sqlGames = 'SELECT * FROM game WHERE player_id = ? AND game_is_del = 0';
       let valuesGames = [id]
     connection.query(sqlGames, valuesGames, (err2, resultGames)=>{
        console.log("resullllllllt", resultGames)
        if(err2){
            throw err2
        }else{
             res.render("unPlayer", {player: result[0], games: resultGames})
        }
     });
     
  }
 })

 
   
 }

 
//  openUnPlayer = (req, res) =>{
//  const {id} = req.params;
// console.log(id)
//  //consultar parametrizadas. el [id] subtituye el 

//  let sql = `SELECT player.*, game.* FROM player
//  LEFT JOIN game ON player.player_id = game.player_id
//  AND game.game_is_del = 0
//  WHERE player.player_is_del = 0 AND player.player_id = ? `

//  let values = [id]

//  connection.query(sql, values, (err, result)=>{
//   if(err){
//      throw err
//   }else{  

//        const {player_id, name, last_name, email, preferences, player_img} = result[0]
// //copiamos todo lo q qeremos mandar del player en pos0, creando un objecto literal
// let play = {
//     player_id: player_id,
//     name: name,
//     last_name: last_name,
//     email: email,
//     preferences: preferences,
//     player_img: player_img
// }

// //recogemos el array de result(todos los datos) yx cda 1 de los result, llenamos el array con los datos de los games

// let gams = []

// result.forEach((elem)=>{

//     if(elem.game_id != null){
//         let newGame = {
//             game_id: elem.game_id,
//             title: elem.title,
//             review: elem.review,
//             starrating:elem.starrating,
//             platform: elem.platform,
//             game_img: elem.game_img,
//             year_release: elem.year_release
//         }
//         gams.push(newGame);
//     }
// })
// console.log("los datos del player", play);
// console.log("los datos de los games", gams);
//      //aqui el nmbre de la propiedad del objecto = nmbre de la var q le da valor

//       res.render("unPlayer", {player: play, games: gams})
  
//  } 
//  })
//  }








//muestra la vista de modificacion de un jugador

openEditPlayer = (req, res) => {
const {id} = req.params;
let sql = 'SELECT player_id, name, last_name FROM player WHERE player_id = ?'
let values = [id]
connection.query(sql, values, (err, result)=>{

    console.log("******", result);

    if(err){
        throw err;
    }else{
        res.render("editPlayer", {playerToEdit: result[0]});
    }
})

}




//modificamos los datos del registro
//req.body recoge los datos de los 2input de tipo texto
// req.params coge el id del action
//req.file trae los datos de tipo file

editPplayer = (req, res)=>{
    const {id} = req.params;
    const {name, last_name} = req.body;

if (!name||!last_name){                                   
    let tempData = {
        name: name,               //se genera 1 objecto tempData con datos mandados via el formedit
       last_name: last_name,             //tiene la misma estructura q el result[0]
        player_id: id                    //+ el id q al dar a acepar nos lleve al post
    }
    res.render("editPlayer", {
        playerToEdit: tempData,              //renderizamos con los datos mandados x el post + 1msg
        message: "All fields are required!"
    })
}else{



    let sql = 'UPDATE player SET name = ?, last_name = ? WHERE player_id = ?'

    //caso de que no venga foto
let values = [name, last_name, id]

//si viene foto
if(req.file){
    sql = 'UPDATE player SET name = ?, last_name = ?, player_img = ?  WHERE player_id = ?'
    values = [name, last_name, req.file.filename, id]
}
connection.query(sql, values, (err, result)=>{
    if(err){
        throw err
    }else{
res.redirect(`/players/unPlayer/${id}`)

    }
})
}  
}


//aqui comprobamos que tanto el email y la contraseña que enviamos 
// está son los datos en nstr db.-> autenticacion


//muestra el formulariode login
openLogin = (req, res)=>{

    res.render("login", {message: ""})

}


 login = (req, res)=>{

           //recoger del req.body el email y el pass q el usuario ha introdicdo
 const {email, password} = req.body;
                       
                          //comprabar q el email existe en la db 
                          //si existe: la select nos manda un objecto dentro de un array
                          //y sino,un array vacio
                        //peticion para traer tdos los players
 let sql = `SELECT * FROM player WHERE email = ? AND player_is_del = 0`

 let values = [email]      
                                 //metemos los valores q sustituye '?'xq es parametrizada

 connection.query(sql, values, (err, result)=>{

    //console.log(result);

 if(err){                                 //length==1, email existe
     throw err
   }else{

if(result.length == 1){
                                     //comprabarsi el pin es =db. result es un array
          //bcrypt via su meth 'compare' compara 1 cadena incrip o 1no delcual se recibe un err o 1result

let hashedPass = result[0].password
bcrypt.compare(password, hashedPass, (errComp, resultCompare)=>{

if(errComp){
    throw errComp
    }else{
    console.log("*****", resultCompare);       //ese resultCompare puede ser true or false
         if(resultCompare == true){                   //la interpolacioon de ${result[0].player_id} nos da el 'id'

             res.redirect(`/players/unPlayer/${result[0].player_id}`)    
         }else{
            res.render("login", {message: "Your password is incorrect"})
     }                                    
}

})

    }else{
      res.render("login", {message: "That TheFunCorner account doesn't exist"})
}

  
 }
 })

    
 }



delTotal = (req, res)=>{
const {player_id} = req.params;
let sql = 'DELETE FROM player WHERE player_id = ?'
connection.query(sql, [player_id], (err, result)=>{
    if(err){
   throw err;

    }else{
        res.redirect('/players')
    }
})
}



delLogic = (req, res)=>{

    const {player_id} = req.params;
let sql = `UPDATE player LEFT JOIN game ON player.player_id = game.player_id
SET player.player_is_del = 1, game.game_is_del = 1
WHERE player.player_id = ?`
connection.query(sql, [player_id], (err, result)=>{
    if(err){
   throw err;

    }else{
        res.redirect('/players')
    }
})
}












}


//exportamos una nueva instancia de la class PlayersController
    
module.exports = new PlayersController();

