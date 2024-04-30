import TelegramBot from 'node-telegram-bot-api';

import { desvincularEmpresa } from './helpers/desvincularEmpresa.js';
import { configurarNotificaciones } from './helpers/configurarNotificaciones.js';
import { recibirToken } from './helpers/recibirToken.js';
import { solicitarCodigo } from './helpers/solicitarCodigo.js';
import { selectAllByChatId, obtenerRazonSocial } from '../bd/bdRequests.js';


export const crearBot = () => {
    const bot = new TelegramBot( process.env.TELEGRAM_BOT_TOKEN, { polling: true } );

    const messageListener = async ( message ) => {
        const text = message.text;
        const chat_id = message.chat.id;

        try {
            const results = await selectAllByChatId( chat_id );
            const BD_chat_id = results[0] ? true : false;

            if( !BD_chat_id ) {
                if( text === '/start' ) {
                    await bot.sendMessage( 
                        chat_id,
                        '¡Bienvenido/a al bot de E-buyplace en Telegram!\n' +
                        'Aquí recibirás las notificaciones del sitio.\n' +
                        'Por favor, ingresa el token para vincular tu empresa. ' +
                        'Puedes generarlo desde el sitio web.'
                    );
                } else {
                    const res = await recibirToken( text, chat_id, bot );
                    if( res ) {
                        bot.off( 'message', messageListener );
                        bot.once( 'message', async ( msg ) => {
                            const vinculacionExitosa = await solicitarCodigo({ 
                                ...res,
                                text: msg.text.trim(),
                                bot
                            });
                            if( !vinculacionExitosa ) {
                                await bot.sendMessage( 
                                    chat_id,
                                    'Ingresar el token nuevamente'
                                );
                            }
                            bot.on( 'message', messageListener );
                        })
                    } else {
                        await bot.sendMessage( 
                            chat_id,
                            'Ingresar el token nuevamente'
                        );
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
                        'Por favor, ingresa el token para vincular la empresa.'
                    );
                    let token, esDobleFactor;
                    bot.off( 'message', messageListener );
                    bot.once( 'message', async ( msg ) => {
                        const text = msg.text;
                        token = await recibirToken( text, chat_id, bot );
                        if( !token ) {
                            await bot.sendMessage(
                                chat_id,
                                'Para vincular una empresa, vuelve a ejecutar el comando /vincular.'
                            );
                        }
                        if( token ) {
                            bot.off( 'message', messageListener );
                            bot.once( 'message', async ( msg ) => {
                                esDobleFactor = await solicitarCodigo({ ...token, text: msg.text.trim(), bot });
                                if( !esDobleFactor ) {
                                    await bot.sendMessage(
                                        chat_id,
                                        'Para vincular una empresa, vuelve a ejecutar el comando /vincular.'
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
                    for ( const [ index, result ] of results.entries() ) {
                        const razonSocial = await obtenerRazonSocial( result.EmpId );
                        empresasVinculadas += 
                            `${ index + 1 }. ${ result.EmpId }( ${ razonSocial[ 0 ] 
                                ? razonSocial[ 0 ].nombre 
                                : 'Nombre de empresa no encontrado'
                            } ) - ${ result.Usuario }\n`;
                    }

                    await bot.sendMessage(
                        chat_id,
                        'Por favor ingresa el número de la empresa que deseas desvincular:\n\n' + 
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
                        'Este bot envía únicamente notificaciones del sitio.\n' +
                        'Si tienes alguna pregunta, contáctanos a través del chat en el sitio web (burbuja naranja) ' +
                        'o envía un correo electrónico a helpdesk@e-buyplace.com.\n\n' +
                        'Para activar las notificaciones, ejecuta el comando /start.\n' +
                        'Para desactivarlas, ejecuta el comando /end.\n' +
                        'Si deseas vincular una nueva empresa, ejecuta el comando /vincular.\n' +
                        'Para desvincular una empresa, utiliza el comando /desvincular.'
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