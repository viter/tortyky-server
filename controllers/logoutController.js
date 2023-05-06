import db from '../utils/prismaClient.js';

const handleLogout = async (req, res) => {
  // On client also delete the accesstoken
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const user = await db.users.findFirst({
    where: {
      refreshToken: { equals: refreshToken },
    },
  });

  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  try {
    await db.users.update({
      where: { id: parseInt(user.id) },
      data: { refreshToken: '' },
    });
  } catch (err) {
    console.log(err);
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }); // secure: true - only serves on https
  res.sendStatus(204);
};

export { handleLogout };
