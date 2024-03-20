import { Connection, Request } from 'tedious';

import { config } from '../bd/config.js'


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