export function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS_REMOTE?.split(",").filter(Boolean) || [];
    const origin = req.headers.origin || "";
    const userAgent = req.headers["user-agent"] || "";

    const isPostmanAllowed = process.env.POSTMAN_ALLOWED === "true";
    const isPostmanRequest = userAgent.includes("Postman");

    const isPublicAPI = process.env.PUBLIC_API === "true";

    // ✅ Permitir Expo Go (Android e iOS)
    const isExpoGoAndroid = userAgent.includes("okhttp"); // Expo Go em Android
    const isExpoGoIOS = /Expo\/\d+ CFNetwork\/\d+\.\d+\.\d+ Darwin\/\d+\.\d+\.\d+/.test(userAgent); // Expo Go em iOS

    const isExpoGo = isExpoGoAndroid || isExpoGoIOS;

    // 🔹 Se não for API pública, faz a verificação de origens permitidas
    if (!isPublicAPI && !allowedOrigins.includes(origin) && !(isPostmanAllowed && isPostmanRequest) && !isExpoGo) {
      console.error(`🚨 Bloqueio de CORS: ${origin} não autorizado. User-Agent: ${userAgent}`);
      return res.status(403).json({ error: "Acesso negado: Origem ou ferramenta não autorizada" });
    }

    // 🔹 Define os cabeçalhos CORS corretamente
    if (isPublicAPI) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "false"); // ⚠ Não pode ser "true" com "*"
    } else {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    // Verificação adicional para garantir que Access-Control-Allow-Origin não seja * quando Access-Control-Allow-Credentials for true
    if (res.getHeader("Access-Control-Allow-Credentials") === "true" && res.getHeader("Access-Control-Allow-Origin") === "*") {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Authorization, Cookie, Set-Cookie"
    );

    // 🔹 Responde imediatamente a requisições OPTIONS (Preflight)
    if (req.method === "OPTIONS") {
      console.log(`🟢 Requisição OPTIONS permitida para: ${origin} (Expo Go: ${isExpoGo})`);
      return res.status(204).end();
    }

    return handler(req, res);
  };
}
