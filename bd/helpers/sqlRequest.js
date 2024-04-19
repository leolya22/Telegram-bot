import { Connection, Request } from 'tedious';

import { config } from '../config.js'


export const sqlRequest = ( sqlStatement ) => {
    return new Promise( ( resolve, reject ) => {
        let results = [];

        const connection = new Connection( config );
        connection.on( 'connect', ( err ) => {  
            if( err ) {
                console.log( err );
                return reject( err );
            }

            const request = new Request( sqlStatement, ( err ) => {
                if ( err ) {
                    console.log( err );
                    return reject( err );
                } else {
                    resolve( results );
                }
                connection.close();
            });
/* PARA RECIBIR PARAMERTOS EN LA CONSULTA DE SQL, POR AHORA NO ES NECESARIO
NECESARIO : Importar TYPES de Tedious y recibir objeto params como argumento

            for ( const key in params ) {
                if ( params.hasOwnProperty( key )) {
                    const param = params[ key ];
                    request.addParameter( key, TYPES.VarChar, param );
                }
            }
*/
            request.on( 'row', ( columns ) => {
                let row = {};
                columns.forEach( column => {
                    row[ column.metadata.colName ] = column.value;
                });
                results.push( row );
            });

            connection.execSql( request );
        });
        connection.connect();
    });
}