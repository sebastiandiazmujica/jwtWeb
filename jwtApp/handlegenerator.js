let jwt = require("jsonwebtoken");
let config = require("./config");
const MongoLib = require("./MongoLib");
var md5 = require('md5')

// Clase encargada de la creación del token

async function traerUsuario() {
  return new Promise((resolve) => {});
}

class HandlerGenerator {
  login(req, res) {
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = md5(req.body.password)
    console.log(password)
    let mockedUsername = "";
    let mockedPassword = "";
    let mockedRole = ''

    MongoLib.getDatabase((db) => {
      MongoLib.findUser(
        db,
        (user) => {
          console.log(user)
          mockedUsername = user.username;
          mockedPassword = user.password;
          mockedRole = user.role;

          console.log(username, mockedUsername, password, mockedPassword);

          // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD

          // Si se especifico un usuario y contraseña, proceda con la validación
          // de lo contrario, un mensaje de error es retornado
          if (username && password) {
            // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
            // de lo contrario, un mensaje de error es retornado
            if (username === mockedUsername && password === mockedPassword) {
              // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
              let token = jwt.sign({ username: username , role: mockedRole }, config.secret, {
                expiresIn: "24h",
              });

              // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
              
              res.json({
                success: true,
                message: "Authentication successful!",
                token: token,
              });
            } else {
              // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
              res.send(400)
            }
          } else {
            res.send(400)
            // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
            // res.send(400).json({
            //   success: false,
            //   message: "Authentication failed! Please check the request",
            // });
          }
        },
        username,
        password
      );
    });
  }

  index(req, res) {
    MongoLib.getDatabase(db=> {
      MongoLib.findDocuments(db, usuarios=>{
        console.log(usuarios)
        res.json(usuarios)
      });
    });
    // Retorna una respuesta exitosa con previa validación del token
    // res.json({
    //   success: true,
    //   message: "Index page",
    // });
  }

  createUser(req, res){
    console.log('holiii-----')
    MongoLib.getDatabase(db => {
      let user = {username: req.body.username, password : md5(req.body.password), role:req.body.role}
      MongoLib.createUser(db,user);
      res.json({
        success: true,
        message: "User created",
      });
    });
  }
}

module.exports = HandlerGenerator;
