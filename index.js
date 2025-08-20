// index.js - Exemplo de API
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        message: 'API funcionando!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Rota para salvar dados (exemplo)
app.post('/api/save', (req, res) => {
    // Aqui você salvaria os dados no banco de dados
    const data = req.body;
    console.log('Dados recebidos:', data);
    
    res.json({ 
        success: true, 
        message: 'Dados recebidos com sucesso',
        receivedData: data
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});