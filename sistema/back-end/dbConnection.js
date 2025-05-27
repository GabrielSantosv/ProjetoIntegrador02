import mysql from 'mysql2/promise';

async function initializeDB() {
    try {
        const connection = await mysql.createPool({
            host: 'localhost', 
            user: 'root',      
            password: 'root', 
            database: 'academia', 
            waitForConnections: true, 
            connectionLimit: 10,     
            queueLimit: 0           
        });

        console.log('Conexão com o banco de dados MySQL estabelecida.');
        
        return connection;

    } catch (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        throw err;  
    }
}

export { initializeDB };