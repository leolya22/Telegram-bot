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
        await enviarMensajeTelegram( 'Se ha eliminado su relación con la empresa ' +
        `${ razonSocial[ 0 ] ? razonSocial[ 0 ].nombre : EmpId }, usuario ${ Usuario } desde el sitio.\n` +
        '\nPara recibir las notificaciones, será necesario vincularse nuevamente.', chat_id );

        return res.json({
            ok: true
        });
    } catch ( error ) {
        return res.status( 400 ).json({
            ok: false,
            message: 'No se pudo borrar la relación del usuario.'
        });
    }
}