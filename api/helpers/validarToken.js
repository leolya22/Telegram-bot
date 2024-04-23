import jwt from 'jsonwebtoken';


export const validarToken = ( token ) => {
    return new Promise( ( resolve, reject ) => {
        jwt.verify( token.trim(), process.env.JWT_SECRET_WORD, ( error, decoded ) => {
            if( error ) {
                resolve( false );
            } else {
                resolve( new Date( decoded.exp * 1000 ).toLocaleString() );
            }
        });
    });
}