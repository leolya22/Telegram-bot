import jwt from 'jsonwebtoken';


export const generarJWT = ( EmpId, Usuario ) => {
    const secretJWT = process.env.JWT_SECRET_WORD;

    return new Promise(( resolve, reject ) => {

        const payload = { EmpId, Usuario };
        let expirationDate = '';
        
        jwt.sign( payload, secretJWT, {
            expiresIn: '30m'
        }, ( error, token ) => {
            if( error ) {
                reject( 'No se pudo generar el token' );
            } else {
                const decodedToken = jwt.decode( token );
                expirationDate = new Date( decodedToken.exp * 1000 ).toLocaleString();
            }
            resolve({ 
                token,
                expirationDate
            });
        });
    })
}