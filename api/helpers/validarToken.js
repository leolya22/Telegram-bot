import jwt from 'jsonwebtoken';


export const validarToken = ( token ) => {
    return new Promise( ( resolve, reject ) => {
        jwt.verify( token.trim(), process.env.JWT_SECRET_WORD, ( error, decoded ) => {
            if( error ) {
                resolve({
                    ok: false,
                    message: ( error.message == "jwt malformed" ) 
                    ? 'El formato del token es incorrecto. Por favor, copialo desde el sitio y proba de nuevo.'
                        : ( error.message == "jwt expired" ) 
                            ? 'El token ha expirado. Solicita uno nuevo desde el sitio.'
                            : 'El token no es válido.'
                });
            } else {
                resolve({
                    ok: true,
                    EmpId: decoded.EmpId,
                    Usuario: decoded.Usuario,
                    valid: new Date( decoded.exp * 1000 ).toLocaleString() 
                });
            }
        });
    });
}