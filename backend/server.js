const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes         = require("./routes/authRoutes");
const plantaRoutes       = require("./routes/plantaRoutes");
const csvRoutes          = require("./routes/csvRoutes");
const planoRoutes        = require("./routes/planoRoutes");
const utilizadoresRoutes = require("./routes/utilizadoresRoutes");
const alertaRoutes = require("./routes/alertaRoutes");
const historicoRoutes = require("./routes/historicoRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const exportRoutes = require("./routes/exportRoutes");
const medicaoRoutes = require("./routes/medicaoRoutes");
const loteRoutes = require("./routes/loteRoutes");
const modoRoutes = require("./routes/modoRoutes");

const app = express();

// Liga à base de dados
connectDB();

// Middlewares
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Servir ficheiros estáticos do frontend (pasta raiz do projeto)
app.use(express.static(path.join(__dirname, "..")));

console.log("🚀 Backend a iniciar...");

// Rotas da API
app.use("/api/auth",          authRoutes);
app.use("/api/plantas",       plantaRoutes);
app.use("/api/csv",           csvRoutes);
app.use("/api/planos",        planoRoutes);
app.use("/api/utilizadores",  utilizadoresRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/historico", historicoRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/medicoes", medicaoRoutes);
app.use("/api/lotes", loteRoutes);
app.use("/api/modo", modoRoutes);

// Rota de health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
    console.log(`   Frontend disponível em http://localhost:${PORT}/index.html`);
    console.log(`   API disponível em     http://localhost:${PORT}/api`);
});
