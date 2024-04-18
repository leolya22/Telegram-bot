import { sqlRequest } from "./helpers/sqlRequest.js";


const { BOT_LINK } = process.env;

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

export const insertarMailConCodigoTelegram = async ( EmpId, Usuario, dobleFactor ) => {
    const cuerpoLibre = `<h3>Estimado/a proveedor</h3><br><br><p>
    Usted solicito vincular su empresa en telegram para recibir las notificaciones de E-BuyPlace a su celular.
    Ya deberia tener copiado el token que tiene que enviar a nuestro <a href='${ BOT_LINK }'>bot de telegram</a>
    Para completar la vinculacion va a necesitar el siguiente codigo: <b>${ dobleFactor }</b></p><br><br>
    <p>Si por algun motivo no se copio el token lo podes copiar con el mismo boton que lo genero</p>`
    const asuntoLibre = `Vinculacion de la empresa ${ EmpId } usuario ${ Usuario } en Telegram.`

    await sqlRequest(
        `INSERT INTO mailsEnvios (idFrom, idUsFrom, idTo, idUsTo, idTipo, fhAlta, 
        param1, param2, param3, estado, fhProc, fhModif, URL, CuerpoLibre, AsuntoLibre) 
        Values ('CG','ADMIN','${ EmpId }','${ Usuario }', 0, getdate(), '', '', '', 
        'N', getdate(), getdate(), '', @CuerpoLibre, @AsuntoLibre)`,
        {
            CuerpoLibre: cuerpoLibre,
            AsuntoLibre: asuntoLibre
        }
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