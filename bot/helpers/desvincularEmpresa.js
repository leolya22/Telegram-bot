import { deleteByChatIdAndEmp } from "../../bd/bdRequests.js";

export const desvincularEmpresa = async ( msg, chat_id, results, bot ) => {
    try {
        const indexEmpresa = Number( msg.text.trim() ) - 1;
        const empresa = results[ indexEmpresa ];
        if( !isNaN( indexEmpresa ) && empresa != undefined ) {
            await deleteByChatIdAndEmp( chat_id, empresa );
            await bot.sendMessage(
                chat_id,
                'La empresa fue desvinculada correctamente.'
            );
            if( results[ 1 ] == undefined ) {
                await bot.sendMessage(
                    chat_id,
                    'Ahora no tenes empresas vinculadas. ' +
                    'Para vincular una empresa es necesario enviar el token que te llego por mail!'
                );
            }
        } else {
            await bot.sendMessage(
                chat_id,
                'Por favor escribir solo el numero corresponiente a la empresa del listado.\n' +
                'Es necesario correr el comando /desvincular de nuevo'
            );
        }
    } catch ( error ) {
        console.log( error );
    }
}