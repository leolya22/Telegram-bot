import { telegramApi } from '../config.js';


export const enviarMensajeTelegram = async( text, chat_id ) => {

    const { data } = await telegramApi.post( `/sendMessage`, { chat_id, text } );

    if ( !data.ok ) {
        throw new Error( `Error al enviar el mensaje: ${ data.description }` );
    }
}
