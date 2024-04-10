import { enviarMensajeTelegram } from "../api/helpers/enviarMensajeTelegram.js";
import { cambiarEstadoMail, recibirCuerpoMail, recibirIdCuerpoMail, recibirListaPorEnviar } from "./bdRequests.js"
import { armarCuerpoMail } from "./helpers/armarCuerpoMail.js";


export const telegramJob = async () => {
    try {
        const results = await recibirListaPorEnviar();

        results.forEach( async ( result ) => {
            const { idMail, chat_id } = result;

            const id = await recibirIdCuerpoMail( idMail );
            const { idTipo, idFrom, param1, param2, param3 } = id[ 0 ];

            //Hardcode, deberia ir el idFrom como EmpId
            const mail = await recibirCuerpoMail( idTipo, 'BR60444437000146' );
            const { subject, body } = mail[ 0 ];

            const text = armarCuerpoMail( subject, body, { param1, param2, param3 } );
            const seEnvioMensaje = await enviarMensajeTelegram( text, chat_id );
            let estado = seEnvioMensaje ? 'Enviado' : 'Bloqueado';
            await cambiarEstadoMail( idMail, chat_id, estado );
        });
    } catch ( error ) {
        console.log( error );
    }
}