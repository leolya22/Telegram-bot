import { sqlRequest } from "./helpers/sqlRequest.js";


export const deleteByChatIdAndEmp = async ( chat_id, empresa ) => {
    await sqlRequest( 
        `delete from telegramUsuarios where chat_id = '${ chat_id }'
        and EmpId = '${ empresa.EmpId }' and Usuario = '${ empresa.Usuario }'`
    );
}

export const selectByEmpAndChatId = async ( EmpId, Usuario, chat_id ) => {
    return await sqlRequest( 
        `select * from telegramUsuarios where EmpId = '${ EmpId }' 
        and Usuario = '${ Usuario }' and chat_id = '${ chat_id }'`
    );
}

export const updateJWTandDobleFactor = async ( dobleFactor, EmpId, Usuario ) => {
    await sqlRequest( 
        `update telegramUsuarios set codigo_doble_factor = '${ dobleFactor }' 
        where EmpId = '${ EmpId }' and Usuario = '${ Usuario }' and chat_id = ''`
    );
}

export const insertEmp = async ( dobleFactor, EmpId, Usuario) => {
    await sqlRequest( 
        `insert into telegramUsuarios ( EmpId, Usuario, chat_id, allow_telegram_notif, codigo_doble_factor )
        Values ( '${ EmpId }', '${ Usuario }', '', 'N', '${ dobleFactor }' )`
    );
}

export const vincularEmp = async ( chat_id, EmpId, Usuario, text ) => {
    await sqlRequest( 
        `update telegramUsuarios set chat_id = '${ chat_id }', 
        allow_telegram_notif = 'S' where EmpId = '${ EmpId }' 
        and Usuario = '${ Usuario }' and codigo_doble_factor = '${ text }'`
    );
}

export const allowNotifications = async ( chat_id ) => {
    await sqlRequest( 
        `update telegramUsuarios set allow_telegram_notif = 'S' where chat_id = '${ chat_id }'`
    );
}

export const blockNotifications = async ( chat_id ) => {
    await sqlRequest( 
        `update telegramUsuarios set allow_telegram_notif = 'N' where chat_id = '${ chat_id }'`
    );
}

export const selectAllByChatId = async ( chat_id ) => {
    return await sqlRequest(
        `select * from telegramUsuarios where chat_id = '${ chat_id }'`
    );
}

export const obtenerRazonSocial = async ( EmpId ) => {
    return await sqlRequest(
        `select * from UsuarioMaestros (nolock) where usr_id in ('${ EmpId }')`
    )
}

export const recibirListaPorEnviar = async () => {
    return await sqlRequest(
        `select * from  telegram_envios (nolock) where Estado = 'N'`
    )
}