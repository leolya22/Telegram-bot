import TelegramBot from 'node-telegram-bot-api';

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
            /* TODO: VERIFICAR SI EL CHAT_ID ESTA REGISTRADO EN LA BASE DE DATOS */
            const BD_chat_id = true; // SI EL CHAT_ID ESTA EN LA BD REGRESA true, SINO false

            if( !BD_chat_id ) {
                if( text === '/start' ) {
                    await bot.sendMessage( 
                        chat_id,
                        'Bienvenido/a al bot de E-buyplace en Telegram. Aca te vamos a enviar las notificaciones del sitio!'
                    );
                    await bot.sendMessage(
                        chat_id,
                        'Me podrias briandar el CUIT(sin guiones, solo numeros) de tu empresa?'
                    );
                } else {
                    const cuit = Number( text );

                    if( isNaN( cuit ) ) {
                        return await bot.sendMessage(
                            chat_id,
                            'Por favor ingresar el CUIT sin guiones, espacios o letras, solo numeros. Podes probar de nuevo?'
                        );
                    } else {
                        /* TODO: VALIDAR SI EL CUIT EXISTE EN LA BASE DE DATOS */
                        /* EN CASO DE QUE EXISTA, PASARLE AL PROVEEDOR LA RAZON SOCIAL Y EL CUIT DE LA BD PARA CONFIRMAR, SI CONFIRMA:
                        GUARDAR EL CHAT_ID Y EL FLAG 'telegram_notifications' CON EL VALOR 'true' EN LA BD, SINO: 
                        await bot.sendMessage(
                            chat_id,
                            'Por favor mandar el CUIT de nuevo.'
                        );*/
                        /* EN CASO DE QUE NO EXISTA: */
                            await bot.sendMessage(
                                chat_id,
                                'El CUIT brindado no existe en nuestra base de datos, podrias revisar si lo escribiste correctamente y probar de nuevo?'
                            );
                    }
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
            console.log( error.message );
        }
    });
}