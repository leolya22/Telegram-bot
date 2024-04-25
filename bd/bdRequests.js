import { sqlRequest } from "./helpers/sqlRequest.js";


export const deleteByChatIdAndEmp = async ( chat_id, empresa ) => {
    await sqlRequest( 
        `delete from telegram_usuarios where chat_id = '${ chat_id }'
        and EmpId = '${ empresa.EmpId }' and Usuario = '${ empresa.Usuario }'`
    );
}

export const selectByEmpAndChatId = async ( EmpId, Usuario, chat_id ) => {
    return await sqlRequest( 
        `select * from telegram_usuarios where EmpId = '${ EmpId }' 
        and Usuario = '${ Usuario }' and chat_id = '${ chat_id }'`
    );
}

export const selectByEmp = async ( EmpId, Usuario ) => {
    return await sqlRequest( 
        `select * from telegram_usuarios where EmpId = '${ EmpId }' 
        and Usuario = '${ Usuario }' and chat_id <> ''`
    );
}

export const updateJWTandDobleFactor = async ( dobleFactor, EmpId, Usuario, jwt ) => {
    await sqlRequest( 
        `update telegram_usuarios set codigo_doble_factor = '${ dobleFactor }', jwt = '${ jwt }' 
        where EmpId = '${ EmpId }' and Usuario = '${ Usuario }' and chat_id = ''`
    );
}

export const insertEmp = async ( dobleFactor, EmpId, Usuario, jwt ) => {
    await sqlRequest( 
        `insert into telegram_usuarios ( EmpId, Usuario, chat_id, allow_telegram_notif, codigo_doble_factor, jwt )
        Values ( '${ EmpId }', '${ Usuario }', '', 'N', '${ dobleFactor }', '${ jwt }' )`
    );
}

export const vincularEmp = async ( chat_id, EmpId, Usuario, text ) => {
    await sqlRequest( 
        `update telegram_usuarios set chat_id = '${ chat_id }', 
        allow_telegram_notif = 'S' where EmpId = '${ EmpId }' 
        and Usuario = '${ Usuario }' and codigo_doble_factor = '${ text }'`
    );
}

export const allowNotifications = async ( chat_id ) => {
    await sqlRequest( 
        `update telegram_usuarios set allow_telegram_notif = 'S' where chat_id = '${ chat_id }'`
    );
}

export const blockNotifications = async ( chat_id ) => {
    await sqlRequest( 
        `update telegram_usuarios set allow_telegram_notif = 'N' where chat_id = '${ chat_id }'`
    );
}

export const selectAllByChatId = async ( chat_id ) => {
    return await sqlRequest(
        `select * from telegram_usuarios where chat_id = '${ chat_id }'`
    );
}

export const obtenerRazonSocial = async ( EmpId ) => {
    return await sqlRequest(
        `select * from UsuarioMaestros (nolock) where usr_id in ('${ EmpId }')`
    )
}

export const insertarMailConCodigoTelegram = async ( EmpId, Usuario, dobleFactor ) => {
    await sqlRequest(
        `INSERT INTO mailsEnvios (idFrom, idUsFrom, idTo, idUsTo, idTipo, fhAlta, 
        param1, param2, param3, estado, fhProc, fhModif, URL, CuerpoLibre, AsuntoLibre) 
        Values ('CG','ADMIN','${ EmpId }','${ Usuario }', 888, getdate(), '${ EmpId }', 
        '${ Usuario }', '${ dobleFactor }', 'N', getdate(), getdate(), '', '', '')`
    )
}


export const recibirListaPorEnviar = async () => {
    await sqlRequest(
        `update telegram_envios set Estado = 'N' where Estado = 'P' 
        and DATEDIFF( HOUR, fhProc, GETDATE() ) >= 1;`
    )
    const resultado = await sqlRequest(
        `UPDATE telegram_envios SET Estado = 'P', fhProc = getdate() 
        OUTPUT inserted.* WHERE Estado = 'N'`
    );

    return resultado;
}

export const marcarListaRecibida = async () => {
    return await sqlRequest(
        `update telegram_envios set Estado = 'P' where Estado = 'N'`
    )
}

export const recibirIdCuerpoMail = async ( idMail ) => {
    return await sqlRequest(
        `select * from mailsenvios (nolock) where idMail = '${ idMail }'`
    )
}

export const recibirCuerpoMail = async ( id, EmpId ) => {
    return await sqlRequest(
        `select * from MailsCabeceras where idTipo = '${ id }' and UsrId = '${ EmpId }'`
    )
}

export const cambiarEstadoMail = async ( idMail, chat_id, estado ) => {
    return await sqlRequest(
        `update telegram_envios set Estado = '${ estado }'
        where idMail = '${ idMail }' and chat_id = '${ chat_id }' `
    )
}

export const marcarMailConError = async ( idMail, chat_id ) => {
    return await sqlRequest(
        `update telegram_envios set Estado = 'E'
        where idMail = '${ idMail }' and chat_id = '${ chat_id }'`
    )
}