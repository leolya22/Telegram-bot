import jwt from 'jsonwebtoken';


export const generarJWT = ( provid ) => {
    const secretJWT = process.env.JWT_SECRET_WORD;

    return new Promise(( resolve, reject ) => {

        const payload = { provid };
        
        jwt.sign( payload, secretJWT, {
            expiresIn: '2h'
        }, ( error, token ) => {
            if( error ) {
                console.log( error );
                reject( 'No se pudo generar el token' );
            }
            resolve( token );
        });
    })
}