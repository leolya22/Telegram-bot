import fetch from 'node-fetch';


export const enviarMensajeTelegram = async( mensaje, telefono ) => {
    const url = `https://api.telegram.org/bot${ TELEGRAM_BOT_TOKEN }/sendMessage`;
    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje
    };

    const response = await fetch( url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( params )
    });

    const data = await response.json();

    if ( !data.ok ) {
        throw new Error( `Error al enviar el mensaje: ${ data.description }` );
    }
}
