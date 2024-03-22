import jwt from 'jsonwebtoken';

import { sqlRequest } from './sqlRequest.js';


export async function recibirToken( text, chat_id, bot ) {
    try {
        const token = text.trim();
        const { provid } = jwt.verify( token, process.env.JWT_SECRET_WORD );
        const result = await sqlRequest( 
            `select * from telegram where chat_id='${ chat_id }' and prov_id='${ provid }'` 
        );
        if ( result[0] ) {
            await bot.sendMessage( 
                chat_id,
                'Esta empresa ya esta asociada.'
            );
        } else {
            await sqlRequest( 
                `insert into telegram ( chat_id, prov_id, allow_telegram_notif ) 
                Values ( '${ chat_id }', '${ provid }', 'S')` 
            );
            await bot.sendMessage( 
                chat_id,
                'La empresa se vinculo correctamente\n\n' +
                'Las notificaciones de E-buyplace estan activadas.\n' +
                'Para desactivarlas es necesario correr el comando /end\n' +
                'Para vincular una empresa mas podes correr el comando /vincular\n' +
                'Para desvincular una de las empresas esta el comando /desvincular'
            );
        }
        return true;
    } catch ( error ) {
        console.log( "Error: ", error.message );
        
        if( error.message == "jwt malformed" ) {
            await bot.sendMessage( 
                chat_id,
                'El formato del token es incorrecto, por favor revisar si lo copiaste correctamente'
            );
        } else if ( error.message == "jwt expired" ) {
            await bot.sendMessage( 
                chat_id,
                'El token expiro, por favor solicitar uno nuevo desde el sitio'
            );
        } else {
            await bot.sendMessage(
                chat_id,
                'El token no es valido, por favor probar de nuevo'
            );
        }
        return false;
    }
}