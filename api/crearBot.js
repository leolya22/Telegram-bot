import TelegramBot from 'node-telegram-bot-api';

import { sqlRequest } from '../helpers/sqlRequest.js';
import { recibirToken } from '../helpers/recibirToken.js';
import { desvincularEmpresa } from '../helpers/desvincularEmpresa.js';
import { configurarNotificaciones } from '../helpers/configurarNotificaciones.js';


export const crearBot = () => {
    const bot = new TelegramBot( process.env.TELEGRAM_BOT_TOKEN, { polling: true } );

    const messageListener = async ( message ) => {
        const text = message.text;
        const chat_id = message.chat.id;

        try {
            const results = await sqlRequest( `select * from telegram where chat_id='${ chat_id }'` );
            const BD_chat_id = results[0] ? true : false;
            const telegramNotifications = ( results[0].allow_telegram_notif == 'S' ) ? true : false;
            let empresasVinculadas = '';
            results.forEach( ( result, index ) => {
                empresasVinculadas += `${ index + 1 }. ${ result.prov_id }\n`
            })

            if( !BD_chat_id ) {
                if( text === '/start' ) {
                    await bot.sendMessage( 
                        chat_id,
                        'Bienvenido/a al bot de E-buyplace en Telegram. ' +
                        'Aca te vamos a enviar las notificaciones del sitio!\n' +
                        'Me podrias briandar el token para vincular tu empresa? ' +
                        'Lo podes encontrar en el sitio en la parte de ...'
                    );
                } else {
                    recibirToken( text, chat_id, bot );
                }
            } else {
                if( text == '/start' || text == '/end' ) { 
                    configurarNotificaciones( text, telegramNotifications, bot, chat_id );
                } 
                else if ( text === '/vincular' ) {
                    await bot.sendMessage(
                        chat_id,
                        'Me podrias briandar el token de acceso de la empresa que queres vincular?'
                    );
                    bot.off( 'message', messageListener );
                    bot.once( 'message', async ( msg ) => {
                        const text = msg.text;
                        const res = await recibirToken( text, chat_id, bot );
                        if( !res ) {
                            await bot.sendMessage(
                                chat_id,
                                'Por favor si necesita vincular una empresa, correr el comando /vincular de nuevo!'
                            );
                        }
                        bot.on( 'message', messageListener );
                    });
                } 
                else if ( text === '/desvincular' ) {
                    await bot.sendMessage(
                        chat_id,
                        'Por favor ingrese el numero de la empresa que quiere desvincular: \n\n' + 
                        empresasVinculadas
                    );
                    try {
                        bot.off( 'message', messageListener );
                        bot.once( 'message', ( msg ) => {
                            desvincularEmpresa( msg, chat_id, results, bot )
                            bot.on( 'message', messageListener );
                        });
                    } catch ( error ) {
                        console.log( error.message );
                    }
                }
                else {
                    await bot.sendMessage( 
                        chat_id,
                        'Este es un bot que envia solamente las notificaciones del sitio.\n' +
                        'Cualquier duda que tengas contactate por chat en el sitio(burbuja naranja)' +
                        ' o a la casilla helpdesk@e-buyplace.com \n\n' +
                        'Para activar las notificaciones es necesario correr el comando /start\n' +
                        'Para desactivarlas - el comando /end\n' +
                        'Si queres vincular una nueva empresa correr el comando /vincular\n' +
                        'Para desvincular una de las empresas esta el comando /desvincular'
                    );
                }
            }
        } catch ( error ) {
            console.log( "Error: ", error.message );
        }
    }

    bot.setMyCommands([
        { command: '/start', description: 'Activar las notificaciones' },
        { command: '/end', description: 'Desactivar las notificaciones' },
        { command: '/vincular', description: 'Vincular una nueva empresa' },
        { command: '/desvincular', description: 'Desvincular una empresa'}
    ]);
    bot.on( 'message', messageListener );
}