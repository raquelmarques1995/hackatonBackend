export function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS_REMOTE?.split(",").filter(Boolean) || [];
    const origin = req.headers.origin || "";
    const userAgent = req.headers["user-agent"] || "";

    const isPostmanAllowed = process.env.POSTMAN_ALLOWED === "true";
    const isPostmanRequest = userAgent.includes("Postman");

    const isPublicAPI = process.env.PUBLIC_API === "true";

    //  Permitir Expo Go (Android e iOS)
    const isExpoGoAndroid = userAgent.includes("okhttp"); // Expo Go em Android
    const isExpoGoIOS = /Expo\/\d+ CFNetwork\/\d+\.\d+\.\d+ Darwin\/\d+\.\d+\.\d+/.test(userAgent); // Expo Go em iOS

    const isExpoGo = isExpoGoAndroid || isExpoGoIOS;

    // =9 Se não for API pública, faz a verificação de origens permitidas
    if (!isPublicAPI && !allowedOrigins.includes(origin) && !(isPostmanAllowed && isPostmanRequest) && !isExpoGo) {
      console.error(`=¨ Bloqueio de CORS: ${origin} não autorizado. User-Agent: ${userAgent}`);
      return res.status(403).json({ error: "Acesso negado: Origem ou ferramenta não autorizada" });
    }

    // =9 Se for uma API pública, permite todas as origens (com cautela)
    if (isPublicAPI) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "false"); // Não pode ser "true" com "*"
    } else {
      res.setHeader("Access-Control-Allow-Origin", origin); // Permite o domínio específico
      res.setHeader("Access-Control-Allow-Credentials", "true"); // Permite credenciais
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Authorization, Cookie, Set-Cookie"
    );

    // =9 Responde imediatamente a requisições OPTIONS (Preflight)
    if (req.method === "OPTIONS") {
      console.log(`=â Requisição OPTIONS permitida para: ${origin} (Expo Go: ${isExpoGo})`);
      return res.status(204).end();
    }

    return handler(req, res);
  };
}
