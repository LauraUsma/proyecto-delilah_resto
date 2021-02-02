//let moment = require('moment');
const express = require('express');
const app =express();
const apiRouter = require('./routes/api');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const jwtClave= "p40y3c70num340_7r3sAcam1c4";
const expressJwt = require('express-jwt');



app.use(expressJwt({ secret: jwtClave, algorithms: ['sha1', 'RS256', 'HS256']}).unless({ path: ["/api/sign", "/api/usuarios/registro",] }));
app.use(express.json());
app.use(cors());
app.use('/api',apiRouter);
app.set('port', 5000);
require('./db');



app.listen(app.get('port'),()=>{
    console.log('servidor iniciado');
})

/*
app.use((err, req, res, next) => {
    if (!err) {
        next();
    } else {
        console.log(JSON.stringify(err));
        res.status(500).send({status: 500, mensaje:'Ha ocurrido un error inesperado'})
    }
})

*/