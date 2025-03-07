import pool from '../../lib/db';
import { allowCors } from "../../lib/cors";
import { verifyToken } from "../../lib/auth"; // Assumindo que você tem a função verifyToken

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
    
    // Caso o token seja inválido ou expirado
    if (!user) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

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

// Garante o bloqueio de CORS - Cross-Origin Resource Sharing.
export default allowCors(handler);