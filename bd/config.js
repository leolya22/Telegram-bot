const { DB_USER, DB_PASSWORD, DB_IP, DB_NAME } = process.env;

export const config = {
    server: DB_IP,
    authentication: {
        type: 'default',
        options: {
            userName: DB_USER,
            password: DB_PASSWORD
        }
    },
    options: {
        encrypt: false,
        database: DB_NAME,
        trustServerCertificate: true
    }
};