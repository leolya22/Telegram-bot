export const generarDobleFactor = () => {
    let numero = Math.floor( Math.random() * 100000000 );
    numero = numero.toString().padStart( 8, '163527' );
    
    return numero;
}