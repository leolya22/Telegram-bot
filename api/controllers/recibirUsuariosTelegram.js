import { response } from "express";

import { selectByEmp } from "../../bd/bdRequests.js";
import { telegramApi } from "../config.js";


export const recibirUsuariosTelegram = async ( req, res = response ) => {
    const EmpId = req.body.EmpId;
    const Usuario = req.body.Usuario;

    try {
        const telegramUsuarios = [];
        const usuarios = await selectByEmp( EmpId, Usuario );
        for ( const { chat_id } of usuarios ) {
            const { data } = await telegramApi.get( `/getChat?chat_id=${ chat_id }` );
            data.result.chat_id = chat_id;
            telegramUsuarios.push( data.result );
        }
        return res.json({
            ok: true,
            telegramUsuarios
        });
    } catch ( error ) {
        console.log(error);
        return res.status( 400 ).json({
            ok: false,
            message: 'No se pudieron obtener los nombres de los usuarios de Telegram!'
        });
    }
}