import express from 'express';
import cors from 'cors';
import { check } from 'express-validator';
import 'dotenv/config';

import { crearTokenJWT } from './api/controllers/crearTokenJWT.js';
import { validarCampos } from './api/middlewares/validarCampos.js';
import { crearBot } from './bot/crearBot.js';
import { telegramJob } from './bd/telegramJob.js';


crearBot();

const app = express();

app.use( cors() );
app.use( express.json() );


app.post(
    '/telegram-bot/token-jwt',
    [
        check( 'EmpId', 'El empid es necesario para crear el token' ).notEmpty(),
        check( 'Usuario', 'El usuario es necesario para crear el token' ).notEmpty(),
        validarCampos
    ],
    crearTokenJWT 
);

async function ejecutarJob() {
    await telegramJob();
    setTimeout( ejecutarJob, 30000 );
}

ejecutarJob();

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
});
