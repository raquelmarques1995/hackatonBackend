import axios from 'axios';
import pool from '../../lib/db';
import Cors from 'cors';

// Inicializa o middleware CORS
const cors = Cors({
    methods: ['GET', 'HEAD'],
    origin: 'api-raquel.nstech.pt', // Substitua pelo seu domínio
  });
  
  // Função para executar o middleware
  function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);
  let connection;
  try {
    // Faz a requisição para a API externa
    const response = await axios.get('https://quotes-api-self.vercel.app/quote');
    
    // Obtém uma conexão do pool
    connection = await pool.getConnection();
    
    // Insere a citação no banco de dados
    const query = 'INSERT INTO quote (quote, author) VALUES (?, ?)';
    const values = [response.data.quote, response.data.author];
    await connection.query(query, values);

    // Retorna uma resposta de sucesso
    res.status(200).json({ message: 'Quote inserted successfully' });
    
  } catch (error) {
    console.error('Error fetching or inserting quote:', error);
    res.status(500).json({ error: 'Failed to fetch or insert quote' });
  } finally {
    if (connection) connection.release();
  }
}