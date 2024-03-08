import { enviarMensajeTelegram } from "../helpers/enviarMensajeTelegram.js";


export const enviarMensaje = async ( req, res ) => {
    try {
        const { mensaje, telefono } = req.body;

        if ( !mensaje || !telefono ) {
            throw new Error( 'El mensaje y el número de teléfono son obligatorios' );
        }

        await enviarMensajeTelegram( mensaje, telefono);

        res.status( 200 ).json({
            success: true,
            message: 'Mensaje enviado correctamente'
        });
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json({
            success: false,
            error: error.message
        });
    }
}