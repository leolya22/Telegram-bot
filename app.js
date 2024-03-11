import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { enviarMensaje } from './controllers/enviarMensaje.js';
import { crearBot } from './api/crearBot.js';


crearBot();

const app = express();

app.use( express.static( 'public' ) );
app.use( cors() );
app.use( express.json() );

app.post( '/telegram-bot/enviar-mensaje', enviarMensaje );

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
});
