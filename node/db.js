const Sequelize = require('sequelize');
const path = 'mysql://root@localhost:33065/delilah_resto';
const sequelize = new Sequelize(path);

sequelize.authenticate().then(()=>{
    console.log('conexión exitosa...');
}).catch(err=>{
    console.log('error de conexión: ', err);
})

module.exports= sequelize;