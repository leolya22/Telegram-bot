import { sqlRequest } from "./sqlRequest.js";

export const desvincularEmpresa = async ( msg, chat_id, results, bot ) => {
    try {
        const numeroDeEmpresa = Number( msg.text.trim() );
        if( !isNaN( numeroDeEmpresa ) && results[ numeroDeEmpresa - 1 ] != undefined ) {
            await sqlRequest( 
                `delete from telegram where chat_id=${ chat_id } and prov_id='${ results[ numeroDeEmpresa - 1 ].prov_id }'`
            );
            await bot.sendMessage(
                chat_id,
                'La empresa fue desvinculada correctamente.'
            );
            if( results[ 1 ] == undefined ) {
                await bot.sendMessage(
                    chat_id,
                    'Ahora no tenes empresas vinculadas. Podes pasar el token para vincular una?'
                );
            }
        } else {
            await bot.sendMessage(
                chat_id,
                'Por favor escribir solo el numero corresponiente a la empresa del listado.\n' +
                'Correr el comando /desvincular de nuevo'
            );
        }
    } catch ( error ) {
        console.log( error );
    }
}