import jwt from 'jsonwebtoken';


export const generarJWT = ( Empid, Usuario ) => {
    const secretJWT = process.env.JWT_SECRET_WORD;

    return new Promise(( resolve, reject ) => {

        const payload = { Empid, Usuario };
        
        jwt.sign( payload, secretJWT, {
            expiresIn: '30m'
        }, ( error, token ) => {
            if( error ) {
                reject( 'No se pudo generar el token' );
            }
            resolve( token );
        });
    })
}