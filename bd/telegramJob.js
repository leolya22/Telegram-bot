import { enviarArchivoTelegram } from "../api/helpers/enviarArchivoTelegram.js";
import { enviarMensajeTelegram } from "../api/helpers/enviarMensajeTelegram.js";
import { cambiarEstadoMail, recibirCuerpoMail, recibirIdCuerpoMail, recibirListaPorEnviar } from "./bdRequests.js"
import { armarCuerpoMail } from "./helpers/armarCuerpoMail.js";


export const telegramJob = async () => {
    try {
        const results = await recibirListaPorEnviar();

        for( let result of results ) {
            try {
                const { idMail, chat_id } = result;

                const id = await recibirIdCuerpoMail( idMail );
                const { idTipo, idFrom, param1, param2, param3, URL, CuerpoLibre , AsuntoLibre } = id[ 0 ];
                let asunto, cuerpo;

                if( CuerpoLibre != null && CuerpoLibre.trim() != '' ) {
                    asunto = AsuntoLibre;
                    cuerpo = CuerpoLibre;
                } else {
                    const mail = await recibirCuerpoMail( idTipo, idFrom );
                    
                    if( mail[ 0 ] == undefined ) {
                        await cambiarEstadoMail( idMail, chat_id, 'I' );
                        continue;
                    }
                    const { subject, body } = mail[ 0 ];
                    asunto = subject;
                    cuerpo = body;
                }

                const text = armarCuerpoMail( asunto, cuerpo, { param1, param2, param3 } );
                const seEnvioMensaje = await enviarMensajeTelegram( text, chat_id );
                let estado = seEnvioMensaje ? 'F' : 'E';
                await cambiarEstadoMail( idMail, chat_id, estado );
                
                if( URL != null && URL.trim() != '' ) {
                    await enviarArchivoTelegram( URL, chat_id );
                }
            } catch ( error ) {
                console.log( error );
            }
        };
    } catch ( error ) {
        console.log( error );
    }
}