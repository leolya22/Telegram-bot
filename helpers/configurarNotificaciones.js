import { sqlRequest } from "./sqlRequest.js";

export const configurarNotificaciones = async ( text, telegramNotifications, bot, chat_id ) => {
    if( text === '/start' ) {
        if ( !telegramNotifications ) {
            await sqlRequest( 
                `update telegram set allow_telegram_notif='S' where chat_id=${ chat_id }`
            );
        } 
        await bot.sendMessage( 
            chat_id,
            'Las notificaciones de E-buyplace estan activadas.\n\n' +
            'Para desactivarlas es necesario correr el comando /end'
        );
    } else {
        if ( telegramNotifications ) {
            await sqlRequest( 
                `update telegram set allow_telegram_notif='N' where chat_id=${ chat_id }`
            );
        } 
        await bot.sendMessage(
            chat_id,
            'Las notificaciones de E-buyplace estan desactivadas.\n\n' +
            'Para activarlas de nuevo es necesario correr el comando /start'
        );
    }
}