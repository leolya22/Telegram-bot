import jwt from 'jsonwebtoken';


export const validarToken = ( token ) => {
    return new Promise( ( resolve, reject ) => {
        jwt.verify( token.trim(), process.env.JWT_SECRET_WORD, ( error, decoded ) => {
            if( error ) {
                resolve({
                    ok: false,
                    message: ( error.message == "jwt malformed" ) 
                        ? 'El formato del token es incorrecto, copialo y proba de nuevo'
                        : ( error.message == "jwt expired" ) 
                            ? 'El token expiro, solicitar uno nuevo desde el sitio'
                            : 'El token no es valido'
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