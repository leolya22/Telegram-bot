import { enviarMensajeTelegram } from "../helpers/enviarMensajeTelegram.js";


export const enviarMensaje = async ( req, res ) => {
    try {
        const { text, chat_id } = req.body;
        await enviarMensajeTelegram( text, chat_id );

        res.status( 200 ).json({
            ok: true,
            message: 'Notificacion enviada correctamente'
        });
    } catch ( error ) {
        res.status( 500 ).json({
            ok: false,
            message: error.response.data.description
        });
    }
}