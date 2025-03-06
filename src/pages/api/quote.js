import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Faz a requisição para a API externa
    const response = await axios.get('https://quotes-api-self.vercel.app/quote');
    
    // Retorna a citação
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
}