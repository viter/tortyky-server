import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../utils/prismaClient.js';

dotenv.config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const user = await db.users.findFirst({
    where: {
      refreshToken: { equals: refreshToken },
    },
  });

  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.email !== decoded.email) return res.sendStatus(403);

    const roles = user.roles;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          name: decoded.name,
          email: decoded.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );
    res.json({ accessToken });
  });
};

export { handleRefreshToken };
