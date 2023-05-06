import db from '../utils/prismaClient.js';

const getAllCakes = async (req, res) => {
  try {
    const torty = await db.torty.findMany();
    res.json(torty);
  } catch (err) {
    console.log(err);
  }
};

const createNewCake = async (req, res) => {
  try {
    await db.torty.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        images: req.body.images,
      },
    });
    res.json({ message: 'tortyk dodano' });
  } catch (err) {
    console.log(err);
  }
};

const updateCake = async (req, res) => {
  const id = parseInt(req.body.id);
  try {
    const tort = await db.torty.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        images: req.body.images,
      },
    });
    res.json({ message: `Cake ${tort.name} updated` });
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

const deleteCake = async (req, res) => {
  try {
    const tort = await db.torty.delete({
      where: {
        id: parseInt(req.body.id),
      },
    });
    res.json({ message: `Cake ${tort.name} deleted` });
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

const getCake = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const tort = await db.torty.findUnique({
      where: { id },
    });
    if (tort) {
      res.json(tort);
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (err) {
    console.log(err);
  }
};

export { getAllCakes, createNewCake, updateCake, deleteCake, getCake };
