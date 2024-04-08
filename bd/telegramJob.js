import { recibirListaPorEnviar } from "./bdRequests.js"


export const telegramJob = async () => {
    try {
        const results = await recibirListaPorEnviar();
        results.forEach( result => {
            //Llamar el job para crear el mail/texto y despues llamar el endpoint
            //Modificar el estado del result a 'Enviado' si devuelve el OK, sino modificar el estado a 'Bloqueado'
        });
    } catch ( error ) {
        console.log( error );
    }
}