import axios from 'axios';
import 'dotenv/config';


const { TELEGRAM_BOT_TOKEN } = process.env;
const TELEGRAM_CHAT_ID = '5284137080';

export const enviarMensajeTelegram = async( mensaje, telefono ) => {

    //GET `https://api.telegram.org/bot${ TELEGRAM_CHAT_ID }/getUpdates`

    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje
    };

    const telegramApi = axios.create({
        baseURL: `https://api.telegram.org/bot${ TELEGRAM_BOT_TOKEN }`
    });
    const { data } = await telegramApi.post( `/sendMessage`, params );

    if ( !data.ok ) {
        throw new Error( `Error al enviar el mensaje: ${ data.description }` );
    }
}
