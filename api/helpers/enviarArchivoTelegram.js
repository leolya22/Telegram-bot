import fs from 'fs'
import path from 'path';
import FormData from 'form-data';

import { enviarMensajeTelegram } from './enviarMensajeTelegram.js';
import { telegramApi } from '../config.js';


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
            return true;
        } catch ( error ) {
            await enviarMensajeTelegram(
                'No se pudo enviar el archivo. Por favor, descárgalo desde el sitio. ' +
                'Puede que aún no esté disponible.',
                chat_id
            )
        }
    } else {
        await enviarMensajeTelegram(
            'No se pudo enviar el archivo. Por favor, descárgalo desde el sitio. ' +
            'Puede que aún no esté disponible.',
            chat_id
        )
    }
}
