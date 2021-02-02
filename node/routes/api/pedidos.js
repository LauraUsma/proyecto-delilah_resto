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
    verificar_role,
    estadodelpedido
} = require('../functions');

//ruta para que el administrador pueda ver los pedidos

router.get('/', verificar_role, (req , res)=>{
    var queryString = '';
    queryString = queryString + ' SELECT us.fullname nombre_usuario, us.phone telefono, pe.id numero_pedido, pe.estado, pe.fecha,pe.forma_pago, pe.total, pd.nombre nombre_producto, dp.cantidad, dp.total_detalle ';
    queryString = queryString + ' from pedidos pe join detalle_pedidos dp on (pe.id= dp.id_pedido) ';
    queryString = queryString + ' join productos pd on (dp.id_producto = pd.id) ';
    queryString = queryString + ' join usuarios us on (pe.id_usuario = us.id) ';
    queryString = queryString + ' join roles rl on (us.role_id = rl.id) ';
    

  let user= req.body.user;

    sequelize.query( queryString, {
      replacements: [user],
        type:sequelize.QueryTypes.SELECT}
        ). then(function (pedidos){
           console.log(pedidos);
            res.send(pedidos);
        }).catch(err =>console.error(err));


 });


 // ruta para que el usuario pueda ver sus pedidos

 router.get('/misordenes', (req , res)=>{
    var queryString = '';
    queryString = queryString + ' SELECT us.fullname nombre_usuario, us.phone telefono, pe.id numero_pedido, pe.estado, pe.fecha,pe.forma_pago, pe.total, pd.nombre nombre_producto, dp.cantidad, dp.total_detalle ';
    queryString = queryString + ' from pedidos pe join detalle_pedidos dp on (pe.id= dp.id_pedido) ';
    queryString = queryString + ' join productos pd on (dp.id_producto = pd.id) ';
    queryString = queryString + ' join usuarios us on (pe.id_usuario = us.id) ';
    queryString = queryString + ' join roles rl on (us.role_id = rl.id) ';
    
    queryString = queryString + ' where us.user = ? ';
    
  let user= req.body.user;

    sequelize.query( queryString, {
      replacements: [user],
        type:sequelize.QueryTypes.SELECT})
        .then(responses =>{
            if(responses.length === 0){
                res.status (404).send({
                    mensaje: ' Aun no has realizado ningun pedido'
                })
            } else{
                res.status(200).send(responses)
        }
        }).catch(err =>console.error(err));


 });




 //**************************** */


 router.put('/estado', verificar_role, estadodelpedido, (req, res) => {
    let{ id, estado }=req.body;
    
       sequelize.query('UPDATE pedidos SET estado = ? WHERE id= ?', {
               replacements: [ estado, id]
           })
           .then(proyects => res.status(200).send({
               status: 'OK',
               mensaje: 'Pedido Actualizado'
           }))
           .catch(err => console.log(err));
   })
   

//************************ */

async function insertar_pedido(pedidos) {
  //let arrayPedido = Object.values(pedido)
  let { id_usuario, estado, fecha, forma_pago, total} = pedidos;

  let resultado = await sequelize.query('INSERT INTO pedidos ( id_usuario, estado, fecha, forma_pago, total) VALUES ( ?, ?, ?, ?, ? )', {
      replacements: [ id_usuario, estado, fecha, forma_pago, total]
  });
  
  //console.log(resultado); [id, ok]
  let id = resultado[0];

  let {detalles} = pedidos;

  for (i=0; i < detalles.length ; i++){
      let resultado2 = sequelize.query('INSERT INTO detalle_pedidos (id, id_pedido,  id_producto, cantidad, total_detalle) VALUES ( ?, ?, ?, ?, ?)', {
          replacements: [id, id, detalles[i].id_producto, detalles[i].cantidad, detalles[i].total_detalle]
      });
  }

      
  return resultado;
}


router.post('/nuevo_pedido', estadodelpedido,(req, res) => {
    
  

  insertar_pedido(req.body)
      .then(responses => 
          
          res.status(200).send({
          status: 'OK',
          mensaje: 'Pedido agregado exitosamente'
      }))
      .catch(err => console.log(err));
})










//Delete para borrar pedidos


async function Borrar_pedido(pedidos) {
  let { id_pedido} = pedidos;

  let resultado = await sequelize.query('DELETE FROM detalle_pedidos WHERE id_pedido =?', {
      replacements: [id_pedido]
  });
  
  let id = resultado[0];

  let {detalles} = pedidos;

  for (i=0; i < detalles.length ; i++){
      let resultado2 = sequelize.query('`SET FOREIGN_KEY_CHECKS = 0; DELETE FROM pedidos WHERE id = ?; SET FOREIGN_KEY_CHECKS = 1;', {
          replacements: [ detalles[i].id]
      });
  }

      
  return resultado;
}



router.delete('/', verificar_role, (req, res) => {
  //let{ id}=req.body;
  
  Borrar_pedido(req.body)
         .then(proyects => res.status(200).send({
             status: 'OK',
             mensaje: 'Pedido Eliminado'
         }))
         .catch(err => console.log(err));
 })
 






/*

router.delete('/', verificar_role, (req, res) => {
  let{ id}=req.body;
  
     sequelize.query(` DELETE FROM detalle_pedidos WHERE id = ?`, {
         replacements: [id]
     })
 
         .then(proyects => res.status(200).send({
             status: 'OK',
             mensaje: 'Pedido Eliminado'
         }))
         .catch(err => console.log(err));
 })
 

 
*/

module.exports=  router;  