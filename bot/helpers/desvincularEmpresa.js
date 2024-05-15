import { deleteByChatIdAndEmp } from "../../bd/bdRequests.js";

export const desvincularEmpresa = async ( msg, chat_id, results, bot ) => {
    try {
        const indexEmpresa = Number( msg.text.trim() ) - 1;
        const empresa = results[ indexEmpresa ];
        if( !isNaN( indexEmpresa ) && empresa != undefined ) {
            await deleteByChatIdAndEmp( chat_id, empresa );
            await bot.sendMessage(
                chat_id,
                'La empresa ha sido desvinculada correctamente.'
            );
            if( results[ 1 ] == undefined ) {
                await bot.sendMessage(
                    chat_id,
                    'Actualmente no tienes empresas vinculadas.\n' +
                    'Para vincular una empresa, necesitas enviar el token, lo podes generar desde el sitio.'
                );
            }
        } else {
            await bot.sendMessage(
                chat_id,
                'Por favor, escribe solo el número correspondiente a la empresa en el listado.\n' +
                'Es necesario ejecutar el comando /desvincular nuevamente.'
            );
        }
    } catch ( error ) {
        await bot.sendMessage(
            chat_id,
            'Ocurrio un error inesperado.\n' +
            'Es necesario ejecutar el comando /desvincular nuevamente.'
        );
    }
}