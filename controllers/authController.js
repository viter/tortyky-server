import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../utils/prismaClient.js';

dotenv.config();

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Username and password are required' });
  //const user = userDB.users.find((person) => person.username === user);
  const user = await db.users.findFirst({
    where: {
      email: { equals: email },
    },
  });

  if (!user) return res.sendStatus(401);

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          name: user.name,
          email: user.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    try {
      await db.users.update({
        where: { id: parseInt(user.id) },
        data: { refreshToken },
      });
    } catch (err) {
      console.log(err);
    }

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};

export { handleLogin };
