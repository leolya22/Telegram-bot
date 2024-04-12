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

export const updateJWTandDobleFactor = async ( dobleFactor, EmpId, Usuario ) => {
    await sqlRequest( 
        `update telegram_usuarios set codigo_doble_factor = '${ dobleFactor }' 
        where EmpId = '${ EmpId }' and Usuario = '${ Usuario }' and chat_id = ''`
    );
}

export const insertEmp = async ( dobleFactor, EmpId, Usuario) => {
    await sqlRequest( 
        `insert into telegram_usuarios ( EmpId, Usuario, chat_id, allow_telegram_notif, codigo_doble_factor )
        Values ( '${ EmpId }', '${ Usuario }', '', 'N', '${ dobleFactor }' )`
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

export const recibirListaPorEnviar = async () => {
    const resultado = await sqlRequest(
        `select * from telegram_envios (nolock) where Estado = 'N'`
    );
    resultado.forEach( async ( res ) => {
        await sqlRequest(
            `update telegram_envios set Estado = 'P' where chat_id = '${ res.chat_id }'`
        )
    });

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
        `update telegram_envios set Estado = '${ estado }', fhProc = getdate() 
        where idMail = '${ idMail }' and chat_id = '${ chat_id }' `
    )
}

export const marcarMailConError = async ( idMail, chat_id ) => {
    return await sqlRequest(
        `update telegram_envios set Estado = 'E', fhProc = getdate() 
        where idMail = '${ idMail }' and chat_id = '${ chat_id }'`
    )
}