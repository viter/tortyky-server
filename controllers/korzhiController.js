import db from '../utils/prismaClient.js';

const getAll = async (req, res) => {
  try {
    const result = await db.korzhi.findMany();
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

const createNew = async (req, res) => {
  try {
    await db.korzhi.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
      },
    });
    res.json({ message: 'Item added' });
  } catch (err) {
    console.log(err);
  }
};

const update = async (req, res) => {
  const id = parseInt(req.body.id);
  try {
    const result = await db.korzhi.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
      },
    });
    res.json({ message: `Item ${result.name} updated` });
  } catch (err) {
    switch (err.code) {
      case 'P2025':
        res.status(404).json({ error: err.meta.cause });
        break;
      default:
        console.log(err);
    }
  }
};

const deleteItem = async (req, res) => {
  try {
    const result = await db.korzhi.delete({
      where: {
        id: parseInt(req.body.id),
      },
    });
    res.json({ message: `Item ${result.name} deleted` });
  } catch (err) {
    switch (err.code) {
      case 'P2025':
        res.status(404).json({ error: err.meta.cause });
        break;
      default:
        console.log(err);
    }
  }
};

const getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.korzhi.findUnique({
      where: { id },
    });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (err) {
    console.log(err);
  }
};

export { getAll, createNew, update, deleteItem, getOne };
