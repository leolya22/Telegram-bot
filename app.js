import express from 'express';
import cors from 'cors';
import { check } from 'express-validator';
import 'dotenv/config';

import { enviarMensaje } from './api/controllers/enviarMensaje.js';
import { crearTokenJWT } from './api/controllers/crearTokenJWT.js';
import { validarCampos } from './api/middlewares/validarCampos.js';
import { crearBot } from './bot/crearBot.js';


crearBot();

const app = express();

app.use( cors() );
app.use( express.json() );

app.post(
    '/telegram-bot/enviar-mensaje',
    [
        check( 'text', 'No se encontro el mensaje a enviar' ).notEmpty(),
        check( 'chat_id', 'El chat_id es necesario para enviar el mensaje' ).notEmpty(),
        validarCampos
    ],
    enviarMensaje 
);
app.post(
    '/telegram-bot/token-jwt',
    [
        check( 'EmpId', 'El empid es necesario para crear el token' ).notEmpty(),
        check( 'Usuario', 'El usuario es necesario para crear el token' ).notEmpty(),
        validarCampos
    ],
    crearTokenJWT 
);

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
});
