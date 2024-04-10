import { telegramApi } from '../config.js';


export const enviarMensajeTelegram = async ( text, chat_id ) => {
    if( chat_id.length > 0 && text.length > 0 ) {
        try {
            await telegramApi.post( `/sendMessage`, { chat_id, text } );
            return true;
        } catch ( error ) {
            return false;
        }
    } else {
        return false;
    }
}
