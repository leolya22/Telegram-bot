import TelegramBot from 'node-telegram-bot-api';

import { sqlRequest } from '../helpers/sqlRequest.js';
import { recibirToken } from '../helpers/recibirToken.js';
import { desvincularEmpresa } from '../helpers/desvincularEmpresa.js';


export const crearBot = () => {
    const bot = new TelegramBot( process.env.TELEGRAM_BOT_TOKEN, { polling: true } );

    const messageListener = async ( message ) => {
        const text = message.text;
        const chat_id = message.chat.id;

        try {
            const results = await sqlRequest( `select * from telegram where chat_id='${ chat_id }'` );
            let BD_chat_id = results[0] ? true : false;

            if( !BD_chat_id ) {
                if( text === '/start' ) {
                    await bot.sendMessage( 
                        chat_id,
                        'Bienvenido/a al bot de E-buyplace en Telegram. ' +
                        'Aca te vamos a enviar las notificaciones del sitio!\n' +
                        'Me podrias briandar el token para vincular tu empresa? Lo podes encontrar en el sitio en la parte de ...'
                    );
                } else {
                    recibirToken( text, chat_id, bot );
                }
            } else {
                const telegramNotifications = ( results[0].allow_telegram_notif == 'S' ) ? true : false;

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
                } else if ( text === '/end' ) {
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
                } else if ( text === '/vincular' ) {
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
                } else if ( text === '/desvincular' ) {
                    let empresasVinculadas = '';
                    results.forEach( ( result, index ) => {
                        empresasVinculadas += `${ index + 1 }. ${ result.prov_id }\n`
                    })
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
                } else {
                    await bot.sendMessage( 
                        chat_id,
                        'Este es un bot que envia solamente las notificaciones del sitio.\n' +
                        'Cualquier duda que tengas contactate por chat en el sitio(burbuja naranja) o a la casilla helpdesk@e-buyplace.com \n\n' +
                        'Para desactivar las notificaciones es necesario correr el comando /end\n' +
                        'Para activarlas - el comando /start\n' +
                        'Si queres vincular una nueva empresa corre el comando /vincular\n' +
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