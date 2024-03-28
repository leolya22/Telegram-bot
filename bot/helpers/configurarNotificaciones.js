import { sqlRequest } from "../../bd/helpers/sqlRequest.js";


export const configurarNotificaciones = async ( text, allowNotif, bot, chat_id ) => {
    if( text === '/start' ) {
        if ( !allowNotif ) {
            await sqlRequest( 
                `update telegramUsuarios set allow_telegram_notif = 'S' where chat_id = ${ chat_id }`
            );
        } 
        await bot.sendMessage( 
            chat_id,
            'Las notificaciones de E-buyplace estan activadas.\n\n' +
            'Para desactivarlas es necesario correr el comando /end'
        );
    } else {
        if ( allowNotif ) {
            await sqlRequest( 
                `update telegramUsuarios set allow_telegram_notif = 'N' where chat_id = ${ chat_id }`
            );
        } 
        await bot.sendMessage(
            chat_id,
            'Las notificaciones de E-buyplace estan desactivadas.\n\n' +
            'Para activarlas de nuevo es necesario correr el comando /start'
        );
    }
}