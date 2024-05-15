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
                'Por favor, introduce el código de 8 dígitos para validar la vinculación. ' +
                'Este código se envio a tu correo electrónico.\n' +
                'Ten en cuenta que el correo electrónico puede tardar hasta 15 minutos en llegar. ' +
                'Si no lo recibes, revisa la carpeta de SPAM o NO DESEADOS.'
            );
            return {
                EmpId,
                Usuario,
                chat_id,
                token
            }
        }
    } else {
        await bot.sendMessage( 
            chat_id,
            message
        );
        return false;
    }
}