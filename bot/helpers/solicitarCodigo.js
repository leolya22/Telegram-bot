import { sqlRequest } from "../../bd/helpers/sqlRequest.js";


export const solicitarCodigo = async ({ Empid, Usuario, chat_id, text, bot }) => {
    try {
        const result = await sqlRequest( 
            `select * from telegramUsuarios where chat_id='' and 
            EmpId = '${ Empid }' and Usuario = '${ Usuario }'` 
        );
        if( text == result[0].codigo_doble_factor ) {
            await sqlRequest( 
                `update telegramUsuarios set chat_id = '${ chat_id }', 
                allow_telegram_notif = 'S' where EmpId = '${ Empid }' 
                and Usuario = '${ Usuario }' and codigo_doble_factor = '${ text }'`
            );
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
    } catch (error) {
        console.log(error);
    }
}