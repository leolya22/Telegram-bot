function replaceString( plantilla, objetivo, parametro ) {
    const regex = new RegExp( objetivo, 'i' );
    const resultado = plantilla.replace( regex, parametro );
    
    return resultado;
}

function eliminarEtiquetasHTML( text ) {
    const regex = /<[^>]*>/g;
    text = text.replace(/&nbsp;/g, ' ');
    
    return text.replace( regex, '' );
}

export const armarCuerpoMail = ( subject, body, parametros ) => {
    let text = '';
    for( let i = 1; i <= 3; i++ ) {
        let objetivo = `#VAR${ i }#`;
        let paramName = `param${ i }`;
        subject = replaceString( subject, objetivo, parametros[ paramName ].trim() );
        body = replaceString( body, objetivo, parametros[ paramName ].trim() );
    }
    text = subject + '\n\n' + '&nbsp;' + body;
    text = eliminarEtiquetasHTML( text );
    return text;
}

