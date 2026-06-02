const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "greenherb_secret_123";

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ erro: "Token em falta. Faz login primeiro." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ erro: "Token inválido ou expirado." });
    }
};
