import axios from 'axios';
import pool from '../../lib/db';

export default async function handler(req, res) {
  try {
    await pool.connect();
    
    // Faz a requisição para a API externa
    const response = await axios.get('https://quotes-api-self.vercel.app/quote');
    
     // Insere a citação no banco de dados
     const query = 'INSERT INTO quote (quote, author) VALUES ($1, $2)';
     const values = [response.data.quote, response.data.author];
     await pool.query(query, values);
 
     // Retorna uma resposta de sucesso
     res.status(200).json({ message: 'Quote inserted successfully' });
     
   } catch (error) {
     console.error('Error fetching or inserting quote:', error);
     res.status(500).json({ error: 'Failed to fetch or insert quote' });
   } finally {
     pool.end();
   }
 }