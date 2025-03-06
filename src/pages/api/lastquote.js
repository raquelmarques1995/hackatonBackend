import pool from '../../lib/db';
import Cors from 'cors';

// Inicializa o middleware CORS
const cors = Cors({
    methods: ['GET', 'HEAD'],
    origin: 'https://quotable-ruddy.vercel.app', // Substitua pelo seu domínio
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
    // Obtém uma conexão do pool
    connection = await pool.getConnection();
    
    // Faz o SELECT do último valor inserido na tabela quote
    const query = 'SELECT * FROM quote ORDER BY id DESC LIMIT 1';
    const [rows] = await connection.query(query);

    // Verifica se encontrou algum resultado
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'No quotes found' });
    }
    
  } catch (error) {
    console.error('Error fetching the last quote:', error);
    res.status(500).json({ error: 'Failed to fetch the last quote' });
  } finally {
    if (connection) connection.release();
  }
}