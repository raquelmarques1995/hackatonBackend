
## .ENV example

# 🔒 Chaves Secretas (Nunca partilhar!)
JWT_SECRET=super_secreto_que_nunca_deves_compartilhar
CRYPTO_SECRET=outra_chave_super_secreta

# 🔑 Configuração do Administrador (testing purposes)
ADMIN_WALLET=0xC7A4ABd1454088deCD8B0829992BB47f7fD49974
Metamask (12 seeds) : awful float egg lab guard scatter chalk crack element strike oval start

# 🗄️ NOME DA BASE DE DADOS
DB_NAME=nextdatabase

# 🗄️ Configuração da Base de Dados REMOTE
DB_HOSTNAME=
DB_USER=
DB_PASSWORD=
DB_SSL_CA_BASE64=

POSTMAN_ALLOWED=true

# 🌍 Configuração do CORS
# 🚀 Em produção, apenas permitir domínios autorizados
CORS_ALLOWED_ORIGINS_REMOTE=https://*.vercel.app,https://*.vercel.app


# 🌍 URLs do Frontend e Backoffice em Produção
FRONTEND_URL_REMOTE=https://*.vercel.app
BACKOFFICE_URL_REMOTE=https://*.vercel.app
APIS_URL_REMOTE=https://*.vercel.app

# 🛠️ Blockchain Node ETH em mainnet (Blockchain production node environment
BLOCKCHAIN_RPC_URL=https://rpc.ankr.com/eth

## NPM INSTALL NODE MODULES * A considerar ******************************************

# 🛠️ MySQL node module (v2)
npm install mysql2

# 🛠️ Encrypt and Decrypt Password (Login & Register)
npm install bcrypt

# 🛠️ Obscure/Hidden and Protected environment
npm install dotenv

# 🛠️ To prevent bots trying to guess with spraying (express-rate-limit).
npm install express-rate-limit

# 🛠️ Blockchain Ethereum node modules
npm install ethers

# 🛠️ Styling Messages
npm install react-toastify

# 🛠️ Create and Manage JWT Tokens
npm install jsonwebtoken

# 🛠️ Create and Manage Cookies
npm install cookie

# 🛠️ Create and Manage API calls fetching services
npm install axios

*****************************************************************

Em qualquer API privada, basta adicionar o middleware:

import { authenticateToken } from "../../lib/auth";
export default async function handler(req, res) {
  authenticateToken(req, res, async () => {
    res.status(200).json({ message: "Acesso permitido!" });
  });
}

+

// Garante o bloqueio de CORS - Cross-Origin Resource Sharing.
import { allowCors } from "../../lib/cors";

...

export default allowCors(handler);

******************************************************************
