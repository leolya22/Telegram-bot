import { selectByEmpAndChatId } from '../../bd/bdRequests.js';
import { validarToken } from '../../api/helpers/validarToken.js';


export async function recibirToken( text, chat_id, bot ) {
    try {
        const token = text.trim();
        const { EmpId, Usuario } = validarToken( token );
        
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
    } catch ( error ) {
        await bot.sendMessage( 
            chat_id,
            ( error.message == "jwt malformed" ) 
                ? 'El formato del token es incorrecto, revisar si lo copiaste correctamente'
                : ( error.message == "jwt expired" ) 
                    ? 'El token expiro, solicitar uno nuevo desde el sitio'
                    : 'El token no es valido'
        );
        return false;
    }
}