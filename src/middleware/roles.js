module.exports = function (allowedRoles = []) {
  // allowedRoles: array like ['admin'] or ['admin','member']
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
};
