import { allowNotifications, blockNotifications } from "../../bd/bdRequests.js";


export const configurarNotificaciones = async ( text, allowNotif, bot, chat_id ) => {
    if( text === '/start' ) {
        if ( !allowNotif ) {
            await allowNotifications( chat_id );
        } 
        await bot.sendMessage( 
            chat_id,
            'Las notificaciones de E-buyplace están activadas.\n\n' +
            'Para desactivarlas, utiliza el comando /end.'
        );
    } else {
        if ( allowNotif ) {
            await blockNotifications( chat_id );
        } 
        await bot.sendMessage(
            chat_id,
            'Las notificaciones de E-buyplace están desactivadas.\n\n' +
            'Para activarlas nuevamente, utiliza el comando /start.'
        );
    }
}