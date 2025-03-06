import pool from '../../lib/db';


export default async function handler(req, res) {
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
