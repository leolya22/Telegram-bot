import { telegramApi } from '../config.js';
import fs from 'fs'
import path from 'path';
import FormData from 'form-data';


const enviarMensajePorError = async ( chat_id, text ) => {
    try {
        await telegramApi.post( `/sendMessage`, { chat_id, text } );
    } catch ( error ) {
        console.log( error );
    }
} 

export const enviarArchivoTelegram = async ( filePath, chat_id ) => {
    if( chat_id.length > 0 && filePath.length > 0 ) {
        const fileStream = fs.createReadStream( filePath );

        const formData = new FormData();
        formData.append( 'chat_id', chat_id );
        formData.append( 'document', fileStream, {
            filename: path.basename( filePath )
        });
        
        try {
            await telegramApi.post( `/sendDocument`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...formData.getHeaders()
                }
            });
        } catch ( error ) {
            await enviarMensajePorError(
                chat_id, 'No se pudo enviar el archivo,' +
                ' por favor descargarlo desde el sitio si ya esta disponible'
            )
        }
    } else {
        await enviarMensajePorError(
            chat_id, 'No se pudo enviar el archivo,' +
            ' por favor descargarlo desde el sitio si ya esta disponible'
        )
    }
}
