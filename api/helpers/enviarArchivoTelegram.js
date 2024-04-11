import { telegramApi } from '../config.js';
import fs from 'fs'
import path from 'path';


export const enviarArchivoTelegram = async ( filePath, chat_id ) => {
    filePath = 'C:/Users/agustina/Desktop/Leo/M79830 - TEST - CAPSA.pdf'
    const formData = {
        chat_id,
        document: {
            value: fs.createReadStream( filePath ),
            options: {
                filename: path.basename( filePath )
            }
        }
    };
    if( chat_id.length > 0 && filePath.length > 0 ) {
        try {
            await telegramApi.post( `/sendDocument`, formData );
            console.log('don');
            return true;
        } catch ( error ) {
            console.log(error);
            return false;
        }
    } else {
        console.log('none');
        return false;
    }
}
