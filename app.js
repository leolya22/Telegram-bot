import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { enviarMensaje } from './controllers/enviarMensaje';


const { TELEGRAM_BOT_TOKEN, PORT } = process.env;

const app = express();

app.use( express.static( 'public' ) );
app.use( cors() );
app.use( express.json() );

app.post( '/enviar-mensaje', enviarMensaje );

app.listen( PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ PORT }` );
});
