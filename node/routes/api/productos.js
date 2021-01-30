const router = require('express').Router();
const sequelize = require('../../db.js');

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

//funcion para buscar productos 

async function consultaProducto(producto) {
    let resultado = await sequelize.query('SELECT * FROM productos WHERE nombre = ?', {
        type: sequelize.QueryTypes.SELECT,
        replacements: [producto]
    })
    return resultado;
}


// funcion para validar el ingreso de productos repetidos

let validacion = (req, res, next)=>{
  
    let nombre = req.body.nombre;
   
    if(nombre){
        consultaProducto(nombre)
        .then(proyects => {
            let producto = proyects.find(p => p.nombre == nombre)
            if (!producto) {
                return next();
            } else if (producto) {
                res.status(409).send({
                    status: 409,
                    mensaje: 'El producto ya existe'
                })
            }
        }).catch(err => console.log(err));
    }
}




// Get para llamar la lista de productos
router.get('/', (req , res)=>{

   sequelize.query('SELECT * FROM productos', {type:sequelize.QueryTypes.SELECT})
    .then(function (productos){
        console.log(productos);
        res.send(productos);
    }).catch(err =>console.error(err));
});


//********************post para crear nuevos productos******************


//funcion para agregar productos

async function nuevo_producto(producto) {
    let data = Object.values(producto)
    let resultado = await sequelize.query('INSERT INTO productos (id, nombre, precio, stock) VALUES (?)', {
        replacements: [data]
    })
    return resultado;
}


router.post('/', verificar_role, validacion, (req, res) => {

    nuevo_producto(req.body)
        .then(proyects => res.status(200).send({
            status: 200,
            mensaje: 'Producto agregado con exito'
        })).catch(err => console.log(err));
})



//put para modificar productos


router.put('/:Id', verificar_role, (req, res) => {
 let{ nombre, precio}=req.body;
 
    sequelize.query(`UPDATE productos SET precio = ? WHERE nombre = ?`, {
            replacements: [ precio, nombre]
        })
        .then(proyects => res.status(200).send({
            status: 'OK',
            mensaje: 'Producto Actualizado'
        }))
        .catch(err => console.log(err));
})


//Delete para borrar productos

router.delete('/', verificar_role, (req, res) => {
    let{ nombre}=req.body;
    
       sequelize.query(`DELETE FROM productos WHERE nombre = ?`, {
               replacements: [ nombre]
           })
           .then(proyects => res.status(200).send({
               status: 'OK',
               mensaje: 'Producto Eliminado'
           }))
           .catch(err => console.log(err));
   })
   






















module.exports= router;  

