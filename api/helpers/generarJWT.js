import jwt from 'jsonwebtoken';


export const generarJWT = ( EmpId, Usuario ) => {
    const secretJWT = process.env.JWT_SECRET_WORD;

    return new Promise(( resolve, reject ) => {

        const payload = { EmpId, Usuario };
        
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