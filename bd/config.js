const { DB_USER, DB_PASSWORD, DB_IP, DB_NAME } = process.env;

export const config = {
    user: DB_USER,
    password: DB_PASSWORD,
    server: DB_IP, 
    database: DB_NAME,
    options: { 
        trustServerCertificate: true,
    } 
};