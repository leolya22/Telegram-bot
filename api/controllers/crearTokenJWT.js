import { response } from "express";

import { generarJWT } from "../helpers/generarJWT.js";
import { generarDobleFactor } from "../helpers/generarDobleFactor.js";
import { insertEmp, selectByEmpAndChatId, updateJWTandDobleFactor } from "../../bd/bdRequests.js";


export const crearTokenJWT = async ( req, res = response ) => {
    const EmpId = req.body.EmpId;
    const Usuario = req.body.Usuario;

    const token = await generarJWT( EmpId, Usuario );
    const dobleFactor = generarDobleFactor();
    
    const results = await selectByEmpAndChatId( EmpId, Usuario, '' );
    if( results[ 0 ] ) {
        await updateJWTandDobleFactor( dobleFactor, EmpId, Usuario );
    } else {
        await insertEmp( dobleFactor, EmpId, Usuario );
    }
    
    res.json({
        ok: true,
        EmpId,
        Usuario,
        token
    })
}