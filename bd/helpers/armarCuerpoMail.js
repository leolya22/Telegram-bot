function replaceString( plantilla, objetivo, parametro ) {
    const regex = new RegExp( objetivo, 'gi' );
    const resultado = plantilla.replace( regex, parametro );
    
    return resultado;
}

function eliminarEtiquetasHTML( text ) {
    const regex = /<[^>]*>/g;
    text = text.replace( /&nbsp;/g, ' ' );
    text = text.replace( /<br>/gi, '\n' );
    text = text.replace( /<br \/>/gi, '\n' );
    text = text.replace( /<br\/>/gi, '\n' );
    text = text.replace( /<\/DIV>/gi, '\n' );
    text = text.replace( /&gt;/g, '>' );
    
    return text.replace( regex, '' );
}

export const armarCuerpoMail = ( asunto, cuerpo, parametros ) => {
    let text = '';
    for( let i = 1; i <= 3; i++ ) {
        let objetivo = `#VAR${ i }#`;
        let paramName = `param${ i }`;
        asunto = replaceString( asunto, objetivo, parametros[ paramName ].trim() );
        cuerpo = replaceString( cuerpo, objetivo, parametros[ paramName ].trim() );
    }
    text = asunto + '\n\n'  + cuerpo;
    text = eliminarEtiquetasHTML( text );
    return text;
}

