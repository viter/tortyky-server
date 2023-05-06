const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles];

    const result = req.roles.map((role) => rolesArray.includes(parseInt(role))).includes(true);

    if (!result) return res.sendStatus(401);

    next();
  };
};

export { verifyRoles };
