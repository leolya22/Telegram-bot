import { response } from "express";

import { deleteByChatIdAndEmp, obtenerRazonSocial, selectAllByChatId } from "../../bd/bdRequests.js";
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
        const results = await selectAllByChatId( chat_id );
        if( !results[ 0 ] ) {
            await enviarMensajeTelegram(
                'Actualmente no tienes empresas vinculadas.\nPara vincular una empresa' +
                ', necesitas enviar el token, lo podes generar desde el sitio.', chat_id
            )
        }

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