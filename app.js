import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Connection } from 'tedious';

import { config } from './bd/config.js'
import { enviarMensaje } from './controllers/enviarMensaje.js';
import { crearBot } from './api/crearBot.js';


const connection = new Connection( config );  
connection.on( 'connect', ( err ) => {  
    if( err ) {
        return console.log( err );
    }
    console.log( "Connected" );  
});
connection.connect();

crearBot();

const app = express();

app.use( express.static( 'public' ) );
app.use( cors() );
app.use( express.json() );

app.post( '/telegram-bot/enviar-mensaje', enviarMensaje );

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
});
