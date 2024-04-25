import { response } from "express";

import { deleteByChatIdAndEmp } from "../../bd/bdRequests.js";


export const borrarRelacionTelegram = async ( req, res = response ) => {
    const EmpId = req.body.EmpId;
    const Usuario = req.body.Usuario;
    const chat_id = req.body.chat_id;

    try {
        await deleteByChatIdAndEmp( chat_id, { EmpId, Usuario } );
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