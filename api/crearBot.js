import TelegramBot from 'node-telegram-bot-api';

export const crearBot = () => {
    const bot = new TelegramBot( process.env.TELEGRAM_BOT_TOKEN, { polling: true } );

    bot.setMyCommands([
        { command: '/start', description: 'Activar las notificaciones de E-buyPlace' },
        { command: '/end', description: 'Desactivar las notificaciones de E-buyPlace' }
    ]);
    bot.on( 'message', async ( message ) => {
        const text = message.text;
        const chat_id = message.chat.id;

        try {
            if( text === '/start' ) {
                await bot.sendMessage( 
                    chat_id,
                    'Bienvenido/a al bot de E-buyplace en Telegram. Aca te vamos a enviar las notificaciones del sitio!\n\n' + 
                    'Para desactivar las notificaciones corre el comando /end'
                );
                /* GUARDAR EL CHAT_ID EN LA BASE DE DATOS */
            } else if ( text === '/end' ) {
                await bot.sendMessage( 
                    chat_id,
                    'Las notificaciones de E-buyplace fueron desactivadas.\n\n' +
                    'Para activarlas de nuevo es necesario correr el comando /start'
                );
                /* BORRAR EL CHAT_ID EN LA BASE DE DATOS */
            } else {
                await bot.sendMessage( 
                    chat_id,
                    'Este es un bot que envia solamente las notificaciones del sitio.\n\n' +
                    'Para desactivar las notificaciones es necesario correr el comando /end\n' +
                    'Para activarlas - el comando /start'
                );
            }
        } catch ( error ) {
            console.log( error.message );
        }
    });
}