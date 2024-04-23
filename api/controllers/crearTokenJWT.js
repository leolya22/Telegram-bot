import { response } from "express";

import { generarJWT } from "../helpers/generarJWT.js";
import { generarDobleFactor } from "../helpers/generarDobleFactor.js";
import { insertEmp, insertarMailConCodigoTelegram, selectByEmpAndChatId, updateJWTandDobleFactor } from "../../bd/bdRequests.js";
import { validarToken } from "../helpers/validarToken.js";


export const crearTokenJWT = async ( req, res = response ) => {
    const EmpId = req.body.EmpId;
    const Usuario = req.body.Usuario;
    
    try {
        const results = await selectByEmpAndChatId( EmpId, Usuario, '' );

        if ( results[0] ) {
            const { jwt } = results[0];
            const tokenIsValid = await validarToken( jwt );
            console.log(tokenIsValid);
            
            if ( tokenIsValid ) {
                return res.json({
                    ok: true,
                    EmpId,
                    Usuario,
                    token: jwt,
                    valid: tokenIsValid
                });
            }
        }
        const { token, expirationDate } = await generarJWT( EmpId, Usuario );
        console.log(token, expirationDate);
        const dobleFactor = generarDobleFactor();
        if ( results[0] ) {
            await updateJWTandDobleFactor( dobleFactor, EmpId, Usuario, token );
        } else {
            await insertEmp( dobleFactor, EmpId, Usuario, token );
        }
        await insertarMailConCodigoTelegram( EmpId, Usuario, dobleFactor );

        return res.json({
            ok: true,
            EmpId,
            Usuario,
            token,
            expirationDate
        });
    } catch ( error ) {
        return res.status( 500 ).json({
            ok: false,
            message: 'Error al crear el token'
        });
    }

/*
    const results = await selectByEmpAndChatId( EmpId, Usuario, '' );
        const { jwt } = results[ 0 ];
        const tokenIsValid = validarToken( jwt );
        console.log( tokenIsValid );    
    const token = await generarJWT( EmpId, Usuario );
    const dobleFactor = generarDobleFactor();
    await insertarMailConCodigoTelegram( EmpId, Usuario, dobleFactor );
    
    if( results[ 0 ] ) {
        await updateJWTandDobleFactor( dobleFactor, EmpId, Usuario, token );
    } else {
        await insertEmp( dobleFactor, EmpId, Usuario, token );
    }
    
    return res.json({
        ok: true,
        EmpId,
        Usuario,
        token
    })*/
}