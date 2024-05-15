import { response } from "express";

import { generarJWT } from "../helpers/generarJWT.js";
import { generarDobleFactor } from "../helpers/generarDobleFactor.js";
import {
    insertEmp, insertarMailConCodigoTelegram, obtenerRazonSocial,
    selectByEmpAndChatId, updateJWTandDobleFactor
} from "../../bd/bdRequests.js";
import { validarToken } from "../helpers/validarToken.js";


export const crearTokenJWT = async ( req, res = response ) => {
    const EmpId = req.body.EmpId;
    const Usuario = req.body.Usuario;
    
    try {
        const results = await selectByEmpAndChatId( EmpId, Usuario, '' );
        const razonSocial = await obtenerRazonSocial( EmpId );
        const nombre = razonSocial[ 0 ]?.nombre || EmpId;

        if ( results[0] ) {
            const { codigo_doble_factor, jwt } = results[0];
            const { ok, valid } = await validarToken( jwt );
            
            if ( ok ) {
                await insertarMailConCodigoTelegram( nombre, EmpId, Usuario, codigo_doble_factor );
                return res.json({
                    ok: true,
                    EmpId,
                    Usuario,
                    token: jwt,
                    valid
                });
            }
        }
        const { token, expirationDate } = await generarJWT( EmpId, Usuario );
        const dobleFactor = generarDobleFactor();
        if ( results[0] ) {
            await updateJWTandDobleFactor( dobleFactor, EmpId, Usuario, token );
        } else {
            await insertEmp( dobleFactor, EmpId, Usuario, token );
        }
        await insertarMailConCodigoTelegram( nombre, EmpId, Usuario, dobleFactor );

        return res.json({
            ok: true,
            EmpId,
            Usuario,
            token,
            valid: expirationDate
        });
    } catch ( error ) {
        return res.status( 500 ).json({
            ok: false,
            message: 'Error al crear el token. Por favor, inténtalo de nuevo más tarde.'
        });
    }
}