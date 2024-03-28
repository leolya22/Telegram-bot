import { response } from "express";

import { generarJWT } from "../helpers/generarJWT.js";
import { generarDobleFactor } from "../helpers/generarDobleFactor.js";
import { sqlRequest } from "../../bd/helpers/sqlRequest.js";


export const crearTokenJWT = async ( req, res = response ) => {
    const Empid = req.body.Empid;
    const Usuario = req.body.Usuario;

    const token = await generarJWT( Empid, Usuario );
    const dobleFactor = generarDobleFactor();
    //Validar EmpId y obtener la razon social
    const results = await sqlRequest( 
        `select * from telegramUsuarios where EmpId = '${ Empid }' and Usuario = '${ Usuario }'`
    );
    if( results[ 0 ] ) {
        await sqlRequest( 
            `update telegramUsuarios set codigo_doble_factor = '${ dobleFactor }' 
            where EmpId = '${ Empid }' and Usuario = '${ Usuario }'`
        );
    } else {
        await sqlRequest( 
            `insert into telegramUsuarios ( EmpId, Usuario, chat_id, allow_telegram_notif, codigo_doble_factor )
            Values ( '${ Empid }', '${ Usuario }', '', 'N', '${ dobleFactor }' )`
        );    
    }
    
    res.json({
        ok: true,
        Empid,
        Usuario,
        token
    })
}