import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeDB } from './dbConnection.js';  
import router from './routes.js'; 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


app.use(express.static('public'));

app.get('/cadastro', (req, res) => {
    res.sendFile('cadastro.html', { root: 'public' });
});

app.use(router);

initializeDB().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err);
});