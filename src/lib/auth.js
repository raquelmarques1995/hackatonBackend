import jwt from "jsonwebtoken";

/**
 * Valida um token JWT e retorna os dados do utilizador autenticado.
 * @param {string} authHeader - Cabeçalho Authorization da requisição.
 * @returns {object} Retorna os dados do utilizador autenticado.
 * @throws {Error} Se o token for inválido ou estiver ausente.
 */
export function verifyToken(authHeader) {
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Autenticação inválida!");
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("=¨ ERRO: JWT_SECRET não está definido!");
    throw new Error("Erro interno no servidor");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Token decodificado:", decoded);
    return decoded;
  } catch (error) {
    console.error("L Token inválido ou expirado:", error.message);
    throw new Error("Token inválido ou expirado");
  }
}