import { allowNotifications, blockNotifications } from "../../bd/bdRequests.js";


export const configurarNotificaciones = async ( text, allowNotif, bot, chat_id ) => {
    if( text === '/start' ) {
        if ( !allowNotif ) {
            await allowNotifications( chat_id );
        } 
        await bot.sendMessage( 
            chat_id,
            'Las notificaciones de E-buyplace estan activadas.\n\n' +
            'Para desactivarlas es necesario correr el comando /end'
        );
    } else {
        if ( allowNotif ) {
            await blockNotifications( chat_id );
        } 
        await bot.sendMessage(
            chat_id,
            'Las notificaciones de E-buyplace estan desactivadas.\n\n' +
            'Para activarlas de nuevo es necesario correr el comando /start'
        );
    }
}