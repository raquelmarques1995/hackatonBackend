import axios from 'axios';
import pool from '../../lib/db';
import { allowCors } from "../../lib/cors"; // Assumindo que você tenha isso no seu projeto
import { verifyToken } from "../../lib/auth"; // Assumindo que a função verifyToken está definida

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  let connection;
  try {
    // =9 Valida o token JWT e obtém os dados do utilizador autenticado
    console.log(" Cabeçalho Authorization recebido:", req.headers.authorization);
    const user = verifyToken(req.headers.authorization);
    console.log(" Token decodificado:", user);
    
    // Aqui você pode adicionar validações adicionais, caso necessário (ex. se o utilizador tem permissões específicas)
    if (!user) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

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

export default allowCors(handler);