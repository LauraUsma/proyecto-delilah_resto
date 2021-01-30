//const sequelize = require('../db.js');

const router = require('express').Router();

// ruta para pedidos
const apiPedidos= require('./api/pedidos');
router.use('/pedidos', apiPedidos);


//ruta para productos
const apiProductos= require('./api/productos');
router.use('/productos', apiProductos);

//ruta para usuarios

const apiUsuarios= require('./api/usuarios');
router.use('/usuarios', apiUsuarios);

//ruta para login

const apisign= require('./api/sign');
router.use('/sign', apisign);





module.exports = router;