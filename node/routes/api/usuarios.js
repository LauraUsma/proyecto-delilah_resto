const router = require('express').Router();
const sequelize = require('../../db.js');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const jwtClave= "p40y3c70num340_7r3sAcam1c4";


const{    
    nuevo_usuario,
    consulta_usuario,
    login,
    buscar_usuarios,
    validarUsuario,
    usuarioExistente,
    roles_usuario,
    user_pass,
    verificar_role
} = require('../functions');


//********************************rutas************************** */

//ruta post para registrar usuarios

router.post('/registro', validarUsuario, roles_usuario, (req, res) => {

    nuevo_usuario(req.body)
        .then(proyects => res.status(200).send({
            status: 200,
            mensaje: ' Usuario agregado exitosamente'
        })).catch(err => console.log(err));
})



//ruta GET que devuelve la información del usuario


router.get('/', (req , res)=>{

   let token = (req.headers.authorization).split(' ')[1];
   let decodificado = jwt.verify(token, jwtClave);
   const usuario= decodificado.user;

   consulta_usuario(usuario)

   .then(arrayUsuarios=>{
       let users= arrayUsuarios.find(u => u.user == usuario)
       res.status(200).send(users)
   })
 });





module.exports=  router;  