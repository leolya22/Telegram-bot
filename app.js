import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Connection, Request } from 'tedious';

import { config } from './bd/config.js'
import { enviarMensaje } from './controllers/enviarMensaje.js';
import { crearBot } from './api/crearBot.js';


const connection = new Connection( config );  
connection.on( 'connect', ( err ) => {  
    if( err ) {
        return console.log( err );
    }
    console.log( "Connected" );
    const request = new Request(
        "select * from facturacustomizacionProv (nolock) where empid='AR3062982706' and provid='AR3070776878'",
        ( err ) => {
            if ( err ) {
                console.log( err );
            }
        }
    );
    request.on( 'row', ( columns ) => {
        columns.forEach( ( column ) => {
            console.log( `${ column.metadata.colName }: ${ column.value }` );
        });
    });
    connection.execSql( request );
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
