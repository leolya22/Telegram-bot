import { enviarArchivoTelegram } from "../api/helpers/enviarArchivoTelegram.js";
import { enviarMensajeTelegram } from "../api/helpers/enviarMensajeTelegram.js";
import { cambiarEstadoMail, recibirCuerpoMail, recibirIdCuerpoMail, recibirListaPorEnviar } from "./bdRequests.js"
import { armarCuerpoMail } from "./helpers/armarCuerpoMail.js";


export const telegramJob = async () => {
    try {
        const results = await recibirListaPorEnviar();

        for( let result of results ) {
            const { idMail, chat_id } = result;

            const id = await recibirIdCuerpoMail( idMail );
            const { idTipo, idFrom, param1, param2, param3, URL } = id[ 0 ];

            const mail = await recibirCuerpoMail( idTipo, idFrom );
            console.log(mail[ 0 ]);
            if( mail[ 0 ] == undefined ) {
                await cambiarEstadoMail( idMail, chat_id, 'I' );
                continue;
            }
            const { subject, body } = mail[ 0 ];

            const text = armarCuerpoMail( subject, body, { param1, param2, param3 } );
            const seEnvioMensaje = await enviarMensajeTelegram( text, chat_id );
            let estado = seEnvioMensaje ? 'F' : 'E';
            
            //hardcode xq no estan configurados los archivos de sql
            const URL2 = 'C:/Users/agustina/Desktop/Leo/M79830 - TEST - CAPaSA.pdf'
            if( URL2 != '' && URL2 != null ) {
                await enviarArchivoTelegram( URL2, chat_id );
            }
            await cambiarEstadoMail( idMail, chat_id, estado );
        };
    } catch ( error ) {
        console.log( error );
    }
}