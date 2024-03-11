import { enviarMensajeTelegram } from "../helpers/enviarMensajeTelegram.js";


export const enviarMensaje = async ( req, res ) => {
    try {
        const { text, chat_id } = req.body;

        if ( !text ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'No se encontro el mensaje para enviar'
            });
        }
        if ( !chat_id ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'El usuario no acepto recibir notificaciones del sitio o no se paso el chat_id'
            });
        }

        await enviarMensajeTelegram( text, chat_id );

        res.status( 200 ).json({
            ok: true,
            message: 'Notificacion enviada correctamente'
        });
    } catch ( error ) {

        console.log( error.response.data );
        res.status( 500 ).json({
            ok: false,
            message: error.response.data.description
        });
    }
}