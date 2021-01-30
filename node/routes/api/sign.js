const router = require('express').Router();
const sequelize = require('../../db.js');
const jwt = require('jsonwebtoken');
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

// Ruta Post para loguear el usuario despues de estar registrado

router.post('/',usuarioExistente, user_pass, (req, res) =>{
    let {user}= req.body;
    let token = jwt.sign({user:user}, jwtClave)

    res.status(200).send(
        {
            status: 200,
            mensaje: 'has iniciado sesión',
            user : user,
            token:token
   
        }
    )
})

 





 


module.exports= router;  
























/*


  //funcion para agregar usuarios

  async function nuevo_usuario(usuario) {
    let data = Object.values(usuario)
    let resultado = await sequelize.query('INSERT INTO usuarios (id, user, fullname, email, phone, address, password,role_id) VALUES (?)', {
        replacements: [data]
    })
    return resultado;
}

//funcion para buscar usuarios 

async function consulta_usuario(usuario) {
    let resultadoUsuario = await sequelize.query('SELECT * FROM usuarios WHERE user = ?', {
        type: sequelize.QueryTypes.SELECT,
        replacements: [usuario]
    })
    return resultadoUsuario;
}


// funcion para validar el ingreso de usuarios repetidos

let validarUsuario = (req, res, next)=>{
  
    let user = req.body.user;
   
    if(user){
        consulta_usuario(user)
        .then(proyects => {
            let usuarioNuevo = proyects.find(U => U.user == user)
            if (!usuarioNuevo) {
                return next();
            } else if (usuarioNuevo) {
                res.status(409).send({
                    status: 409,
                    mensaje: 'El usuario ya existe'
                })
            }
        }).catch(err => console.log(err));
    }
}



router.post('/', validarUsuario, (req, res) => {

    const user = nuevo_usuario(req.body);

    res.json(user)
    //const token = jwt.sign({user}, )
    /*nuevo_usuario(req.body)
        .then(proyects => res.status(200).send({
            status: 200,
            mensaje: 'Usuario agregado exitosamente'
        })).catch(err => console.log(err));
})
*/