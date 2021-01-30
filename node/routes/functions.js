const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const jwtClave= "p40y3c70num340_7r3sAcam1c4";
const sequelize = require('../db.js');


//*********funciones **********/

 //funcion para agregar usuarios

 async function nuevo_usuario(usuario) {
    let data = Object.values(usuario)
    let resultado = await sequelize.query('INSERT INTO usuarios (id, user, fullname, email, phone, address, password,role_id) VALUES (?)', {
        replacements: [data]
    })
    return resultado;
}


//funcion buscar 1 usuario

async function consulta_usuario(usuario){
    let resultadoUsuario = await sequelize.query('SELECT * FROM usuarios WHERE user = ?',{
        type: sequelize.QueryTypes.SELECT,
        replacements:[usuario]
       
    })
    return resultadoUsuario
}


//funcion login

async function login(user,password){
    let resultadoLogin = await sequelize.query('SELECT * FROM usuarios WHERE user = ? AND password = ?',{
        replacements: [user, password],
        type: sequelize.QueryTypes.SELECT

    })
if (resultadoLogin == '' ) {
        throw new err
}
    return resultadoLogin;
}


//funcion buscar todos los usuarios

async function buscar_usuarios(){
    let resultado_buscar_usuario = await sequelize.query('SELECT * FROM usuarios',{
        type: sequelize.QueryTypes.SELECT
    })
    return resultado_buscar_usuario
}

/****************************************************************************************************** */


// middlware para validar el ingreso de usuarios repetidos

let validarUsuario = (req, res, next)=>{
  
    let user = req.body.user;
   
    if(user){
        consulta_usuario(user)
        .then(proyects => {
            let usuarioNuevo = proyects.find(Usuario => Usuario.user == user)
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

// middlware para validar el ingreso de usuarios no logueados

let usuarioExistente = (req, res, next) => {
    let user = req.body.user;
   
    if(user){
        consulta_usuario(user)
        .then(proyects => {
            let usuarioNuevo = proyects.find(U => U.user == user)
            if (usuarioNuevo) {
                return next();
            } else if (!usuarioNuevo) {
                res.status(409).send({
                    status: 409,
                    mensaje: 'El usuario no existe'
                })
            }
        }).catch(err => console.log(err));
    }
}


// middlware para validar roles


let roles_usuario = (req, res, next) => {
    let {role_id} = req.body;
    if(role_id === '5' || role_id === '6'){
        next();
    } else{
        res.status(409).send({
            status:'error',
            mensaje:'El campo roles solo acepta 5 para Administrador ó 6 para Usuario'
        })
    }
}


// middlware para validar usuario y contraseña

let user_pass = (req, res, next) => {
    let {user, password} = req.body;
    login(user, password)
        .then(proyects => {
            let usuario = proyects.find(u => u.user == user && u.password == password)
            if (usuario) {
                return next();
            } else if (!usuario) {
                res.status(404).send({
                    status: 404,
                    mensaje: 'el usuario o la contraseña son incorrectos'
                });
            }
        })
}


// middlware para validar token

let verificar_role = (req, res, next) => {

    let token = (req.headers.authorization).split(' ')[1];
    
    let decodificado = jwt.verify(token, jwtClave)

    const usuario = decodificado.user;

    consulta_usuario(usuario)
        .then(arrayUsuarios =>{
            let user = arrayUsuarios.find(Usuario => Usuario.user == usuario)
            if(user.role_id === 5){
                next();
            } else {
                res.status(403).send({
                    status:403,
                    mensaje:'solo el Administrador puede realizar esta acción'
                })
            }
        })
}


//*************middlware para verificar estados del pedido******** */

const estadodelpedido = (req, res, next)=>{
    let {estado} = req.body;
    if( estado === 'confirmado' || estado === 'en preparación' || estado === 'enviando' || estado === 'en camino' || estado === 'entregado'){
        next();
    } else{
        res.status(409).send({
            status:'error',
            mensaje:'Ingrese un estado válido'
        })
    }
}

module.exports = {

    nuevo_usuario,
    consulta_usuario,
    login,
    buscar_usuarios,
    validarUsuario,
    usuarioExistente,
    roles_usuario,
    user_pass,
    verificar_role,
    estadodelpedido


}