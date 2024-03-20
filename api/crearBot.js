import TelegramBot from 'node-telegram-bot-api';
import jwt from 'jsonwebtoken';

import { sqlRequest } from '../helpers/sqlRequest.js';


export const crearBot = () => {
    const bot = new TelegramBot( process.env.TELEGRAM_BOT_TOKEN, { polling: true } );

    bot.setMyCommands([
        { command: '/start', description: 'Activar las notificaciones de E-buyPlace' },
        { command: '/end', description: 'Desactivar las notificaciones de E-buyPlace' },
        { command: '/cuit', description: 'Borrar el CUIT activo' }
    ]);
    bot.on( 'message', async ( message ) => {
        const text = message.text;
        const chat_id = message.chat.id;

        try {
            const results = await sqlRequest( `select * from telegram where chat_id='${ chat_id }1'` );
            let BD_chat_id = results[0] ? true : false;

            if( !BD_chat_id ) {
                if( text === '/start' ) {
                    await bot.sendMessage( 
                        chat_id,
                        'Bienvenido/a al bot de E-buyplace en Telegram. Aca te vamos a enviar las notificaciones del sitio!'
                    );
                    await bot.sendMessage(
                        chat_id,
                        'Me podrias briandar el token de acceso? Lo podes encontrar en el sitio en la parte de ...'
                    );
                } else {
                    const token = text.trim();
                    const { provid, exp } = jwt.verify( token, process.env.JWT_SECRET_WORD );
                    console.log(provid);
                    /* PARA VALIDAR LA FECHA : console.log(Date.now());*/
                    await sqlRequest( `insert into telegram ( chat_id, prov_id, allow_telegram_notif ) Values ( '${ chat_id }', '${ provid }', 'S')` );
                    /* EN CASO DE QUE EXISTA GUARDAR EL CHAT_ID Y EL FLAG 'telegram_notifications'
                    CON EL VALOR 'true' EN LA BD */
                    /* EN CASO DE QUE NO EXISTA: */
                        
                        //if () {}
                }
            } else {
                const telegramNotifications = false; /* TODO: REGRESAR EL FLAG 'telegram_notifications' de la BD */
                if( text === '/start' ) {
                    if ( !telegramNotifications ) {
                        /* TODO: MARCAR EL FLAG 'telegram_notifications' COMO 'true' */
                    }
                    await bot.sendMessage( 
                        chat_id,
                        'Las notificaciones de E-buyplace estan activadas.\n\n' +
                        'Para desactivarlas es necesario correr el comando /end'
                    );
                } else if ( text === '/end' ) {
                    if ( telegramNotifications ) {
                        /* TODO: MARCAR EL FLAG 'telegram_notifications' COMO 'false' */
                    }
                    await bot.sendMessage(
                        chat_id,
                        'Las notificaciones de E-buyplace estan desactivadas.\n\n' +
                        'Para activarlas de nuevo es necesario correr el comando /start'
                    );
                } else if ( text === '/cuit' ) {
                    /* TODO: CONFIRMAR SI REALMENTE QUIERE CAMBIAR EL CUIT, PASARLE EL CUIT Y LA RAZON SOCIAL */
                    /* SI CONFIRMA: BORRAR EL VALOR DEL CHAT_ID EN LA BASE DE DATOS Y :*/
                        await bot.sendMessage(
                            chat_id,
                            'El CUIT fue borrado correctamente.\n\n' +
                            'Por favor indicar el CUIT correcto:'
                        );
                    /* SI NO CONFIRMA:  */
                        await bot.sendMessage(
                            chat_id,
                            'Genial, quedo el mismo CUIT.\n\n' +
                            'Van a seguir llegando notificaciones de E-buyplace.'
                        );
                } else {
                    await bot.sendMessage( 
                        chat_id,
                        'Este es un bot que envia solamente las notificaciones del sitio.\n' +
                        'Cualquier duda que tengas contactate por chat en el sitio(burbuja naranja) o a la casilla helpdesk@e-buyplace.com \n\n' +
                        'Para desactivar las notificaciones es necesario correr el comando /end\n' +
                        'Para activarlas - el comando /start'
                    );
                }
            }
        } catch ( error ) {
            console.log( "Error: ", error.message );
            if( error.message == "jwt malformed" ) {
                await bot.sendMessage( 
                    chat_id,
                    'El formato del token es incorrecto, por favor revisar si lo copiaste correctamente'
                );
            } else {
                await bot.sendMessage(
                    chat_id,
                    'El token no es valido, por favor probar de nuevo'
                );
            }
        }
    });
}