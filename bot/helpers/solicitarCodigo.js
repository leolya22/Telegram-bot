import jwt from 'jsonwebtoken';

import { selectByEmpAndChatId, vincularEmp } from "../../bd/bdRequests.js";


export const solicitarCodigo = async ({ EmpId, Usuario, chat_id, token, text, bot }) => {
    try {
        const result = await selectByEmpAndChatId( EmpId, Usuario, '' );
        if( text == result[0].codigo_doble_factor ) {
            jwt.verify( token, process.env.JWT_SECRET_WORD );
            await vincularEmp( chat_id, EmpId, Usuario, text );
            await bot.sendMessage( 
                chat_id,
                'La empresa se vinculo correctamente\n\n' +
                'Las notificaciones de E-buyplace estan activadas.\n' +
                'Para desactivarlas es necesario correr el comando /end\n' +
                'Para vincular una empresa mas podes correr el comando /vincular\n' +
                'Para desvincular una de las empresas esta el comando /desvincular'
            );
            return true;
        } else {
            await bot.sendMessage( 
                chat_id,
                'No se pudo vincular la empresa. El codigo ingresado es incorrecto.'
            );
            return false;
        }
    } catch ( error ) {
        await bot.sendMessage( 
            chat_id,
            'No se pudo vincular la empresa. Parece que caduco el token, ' +
            'por favor solicitar uno nuevo y repetir el proceso.'
        );
        return false;
    }
}