import { response } from "express";

import { deleteByChatIdAndEmp, obtenerRazonSocial } from "../../bd/bdRequests.js";
import { enviarMensajeTelegram } from "../helpers/enviarMensajeTelegram.js";


export const borrarRelacionTelegram = async ( req, res = response ) => {
    const EmpId = req.body.EmpId;
    const Usuario = req.body.Usuario;
    const chat_id = req.body.chat_id;

    try {
        await deleteByChatIdAndEmp( chat_id, { EmpId, Usuario } );
        const razonSocial = await obtenerRazonSocial( EmpId );
        await enviarMensajeTelegram( 'Su usuario de Telegram fue desvinculado desde el sitio para la empresa ' +
        `${ razonSocial[ 0 ] ? razonSocial[ 0 ].nombre : EmpId } usuario ${ Usuario }!` +
        '\nPara recibir las notificaciones va a ser necesario vincularse de nuevo', chat_id );

        return res.json({
            ok: true
        });
    } catch ( error ) {
        return res.status( 400 ).json({
            ok: false,
            message: 'No se pudo borrar la relacion del usuario '
        });
    }
}