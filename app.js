import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { crearBot } from './bot/crearBot.js';
import { telegramJob } from './bd/telegramJob.js';
import usuariosRouter from './routes/usuarios.js';
import tokenRouter from './routes/token.js';


crearBot();

//Cada cuantos ms va a consultar las notificaciones pendientes de enviar
async function ejecutarJob() {
    await telegramJob();
    setTimeout( ejecutarJob, 30000 );
}
ejecutarJob();


const app = express();
app.use( cors() );
app.use( express.json() );

app.use( '/telegram-bot/token-jwt', tokenRouter )
app.use( '/telegram-bot/usuarios', usuariosRouter );


app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
});