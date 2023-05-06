import bcrypt from 'bcrypt';
import db from '../utils/prismaClient.js';

const handleNewUser = async (req, res) => {
  const { name, email, roles, password } = req.body;
  if (!name || !password || !email)
    return res.status(400).json({ message: 'Username, email and password are required' });

  const duplicate = await db.users.findFirst({
    where: {
      email: { equals: email },
    },
  });

  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = { name, email, roles, password: hashedPwd };

    await db.users.create({ data: newUser });

    res.status(201).json({ success: `New user ${name} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { handleNewUser };
