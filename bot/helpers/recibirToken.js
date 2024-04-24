import { selectByEmpAndChatId } from '../../bd/bdRequests.js';
import { validarToken } from '../../api/helpers/validarToken.js';


export async function recibirToken( text, chat_id, bot ) {
    const token = text.trim();
    const { ok, message, EmpId, Usuario } = await validarToken( token );
    if( ok ) {
        const result = await selectByEmpAndChatId( EmpId, Usuario, chat_id );
        if ( result[0] ) {
            await bot.sendMessage( 
                chat_id,
                'Este usuario ya esta asociado en este chat.'
            );
        } else {
            await bot.sendMessage( 
                chat_id,
                'Me pasas el codigo de 8 digitos para validar la vinculacion?' +
                'Deberia haber llegado por mail.\n Recordamos que el mail puede tardar en llegar hasta 15 minutos. ' +
                'Si no llega por favor revisar la carpeta SPAM o NO DESEADOS'
            );
            return {
                EmpId,
                Usuario,
                chat_id,
                token
            }
        }
    } else {
        console.log( ok, message);
        await bot.sendMessage( 
            chat_id,
            message
        );
        return false;
    }
}