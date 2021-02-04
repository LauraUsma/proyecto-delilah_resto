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
  let { id_usuario, estado, fecha, forma_pago, total} = pedidos;

  let resultado = await sequelize.query('INSERT INTO pedidos ( id_usuario, estado, fecha, forma_pago, total) VALUES ( ?, ?, ?, ?, ? )', {
      replacements: [ id_usuario, estado, fecha, forma_pago, total]
  });
  
  
      
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
 
let resultado_1 = await sequelize.query(' DELETE  FROM pedidos WHERE id = ?', {
    replacements: [id_pedido]
});
      
  return resultado_1;
 
}



router.delete('/', verificar_role, (req, res) => {
  
  Borrar_pedido(req.body)
         .then(proyects => res.status(200).send({
             status: 'OK',
             mensaje: 'Pedido Eliminado'
         }))
         .catch(err => console.log(err));
 })
 






module.exports=  router;  