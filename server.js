// server.js

// 🚨 IMPORTANTE: Certifique-se de instalar 'node-fetch' com: npm install node-fetch@2.6.7
const express = require("express");
const fetch = require("node-fetch"); // Usando node-fetch para compatibilidade
const path = require("path");
const app = express();
const PORT = 3000;

// ✅ SUAS CREDENCIAIS OFICIAIS DA SOUNDCLOUD DEVELOPER
// ATENÇÃO: Em produção, estas chaves devem vir de um arquivo .env, não do código.
const CLIENT_ID = "L6qPnsZ05UQfxjOSCOKJHtv49PEFRa5W";
const CLIENT_SECRET = "hlplt8KguzOAxrrSezEIPH1lz2wlTMd9aK";

// Variáveis para armazenar o token e tempo de expiração (para reutilização)
let accessToken = null;
let tokenExpiresAt = 0;

// 🔁 Função para gerar e armazenar o token OAuth2 (Client Credentials Flow)
async function getAccessToken() {
    // Verifica se o token atual ainda é válido
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    console.log("🔑 Solicitando novo token ao SoundCloud...");

    try {
        const response = await fetch("https://api.soundcloud.com/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "client_credentials",
                // 🛑 CORREÇÃO: Adicionando o parâmetro 'scope=nonexpiring'
                scope: "nonexpiring", 
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("❌ Erro ao obter token:", response.status, errText);
            throw new Error(`Falha ao obter token do SoundCloud. Status: ${response.status}`);
        }

        const data = await response.json();

        accessToken = data.access_token;
        tokenExpiresAt = Date.now() + data.expires_in * 1000; 

        console.log("✅ Token obtido com sucesso. Expira em:", Math.ceil(data.expires_in / 3600), "h");
        return accessToken;
    } catch (error) {
        console.error("❌ Erro grave na função getAccessToken:", error.message);
        throw new Error("Falha de conexão ou credenciais inválidas.");
    }
}

// 🔍 Rota para busca de faixas: /api/search?q=query
app.get("/api/search", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Query ausente" });

    try {
        const token = await getAccessToken(); // Garante que temos um token válido
        
        // URL da API v2 para busca de faixas
        const url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(q)}&limit=10`;
        
        const response = await fetch(url, {
            headers: { Authorization: `OAuth ${token}` }, // Passa o token no cabeçalho
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro da API de busca:", data);
            return res.status(response.status).json({ error: "Erro ao buscar faixas no SoundCloud", details: data });
        }

        res.json(data); // Retorna os resultados da coleção
    } catch (error) {
        console.error("❌ Erro ao buscar faixas:", error.message);
        res.status(500).json({ error: "Erro interno no servidor ou falha de autenticação." });
    }
});

// ▶️ Rota para obter o URL de streaming de uma faixa específica: /api/track/:id
app.get("/api/track/:id", async (req, res) => {
    const trackId = req.params.id;

    try {
        const token = await getAccessToken(); // Garante que temos um token válido
        
        // URL da API v2 para faixas específicas
        const url = `https://api-v2.soundcloud.com/tracks/${trackId}`;
        
        const response = await fetch(url, {
            headers: { Authorization: `OAuth ${token}` }, 
        });

        const trackData = await response.json();

        if (!response.ok) {
            console.error("Erro da API ao buscar faixa:", trackData);
            return res.status(response.status).json({ error: "Falha ao obter detalhes da faixa." });
        }
        
        res.json(trackData);

    } catch (error) {
        console.error("❌ Erro ao obter stream da faixa:", error.message);
        res.status(500).json({ error: "Erro interno ao processar a reprodução." });
    }
});

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
