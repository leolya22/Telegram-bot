import TelegramBot from 'node-telegram-bot-api';

import { desvincularEmpresa } from './helpers/desvincularEmpresa.js';
import { configurarNotificaciones } from './helpers/configurarNotificaciones.js';
import { sqlRequest } from '../bd/helpers/sqlRequest.js';
import { recibirToken } from './helpers/recibirToken.js';
import { solicitarCodigo } from './helpers/solicitarCodigo.js';


export const crearBot = () => {
    const bot = new TelegramBot( process.env.TELEGRAM_BOT_TOKEN, { polling: true } );

    const messageListener = async ( message ) => {
        const text = message.text;
        const chat_id = message.chat.id;

        try {
            const results = await sqlRequest(
                `select * from telegramUsuarios where chat_id = '${ chat_id }'`
            );
            const BD_chat_id = results[0] ? true : false;

            if( !BD_chat_id ) {
                if( text === '/start' ) {
                    await bot.sendMessage( 
                        chat_id,
                        'Bienvenido/a al bot de E-buyplace en Telegram. ' +
                        'Aca te vamos a enviar las notificaciones del sitio!\n' +
                        'Me podrias briandar el token para vincular tu empresa? ' +
                        'Lo podes encontrar en el mail que te llego, junto al link de telegram!'
                    );
                } else {
                    const res = await recibirToken( text, chat_id, bot );
                    if( res ) {
                        bot.off( 'message', messageListener );
                        bot.once( 'message', async ( msg ) => {
                            await solicitarCodigo({ ...res, text: msg.text.trim(), bot });
                            bot.on( 'message', messageListener );
                        })
                    } else {
                        console.log('rerror');
                    }
                }
            } else {
                const allowNotif = ( results[0].allow_telegram_notif == 'S' ) ? true : false;

                if( text == '/start' || text == '/end' ) { 
                    configurarNotificaciones( text, allowNotif, bot, chat_id );
                } 
                else if ( text === '/vincular' ) {
                    await bot.sendMessage(
                        chat_id,
                        'Me podrias briandar el token de acceso(que se envio por mail)' +
                        ' de la empresa que queres vincular?'
                    );
                    let token, esDobleFactor;
                    bot.off( 'message', messageListener );
                    bot.once( 'message', async ( msg ) => {
                        const text = msg.text;
                        token = await recibirToken( text, chat_id, bot );
                        if( !token ) {
                            await bot.sendMessage(
                                chat_id,
                                'Para vincular una empresa se necesita correr el comando /vincular de nuevo!'
                            );
                        }
                        if( token ) {
                            bot.off( 'message', messageListener );
                            bot.once( 'message', async ( msg ) => {
                                esDobleFactor = await solicitarCodigo({ ...token, text: msg.text.trim(), bot });
                                if( !esDobleFactor ) {
                                    await bot.sendMessage(
                                        chat_id,
                                        'Para vincular una empresa se necesita correr el comando /vincular de nuevo!'
                                    );
                                };
                                bot.on( 'message', messageListener );
                            });
                        } else {
                            bot.on( 'message', messageListener );
                        }
                    });
                } 
                else if ( text === '/desvincular' ) {
                    let empresasVinculadas = '';
                    // Hacer la peticion para obtener la razon social.
                    results.forEach( ( result, index ) => {
                        empresasVinculadas += 
                        `${ index + 1 }. ${ result.EmpId }( Razon social ) - ${ result.Usuario }\n`
                    });

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