module.exports = function (rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.perfil)) {
      return res.status(403).json({ erro: "Sem permissões" });
    }
    next();
  };
};