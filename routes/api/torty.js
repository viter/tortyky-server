import express from 'express';
import {
  getAllCakes,
  createNewCake,
  updateCake,
  deleteCake,
  getCake,
} from '../../controllers/tortyController.js';
import { ROLES_LIST } from '../../config/roles.js';
import { verifyRoles } from '../../middleware/verifyRoles.js';
import { verifyJWT } from '../../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .get(getAllCakes)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), createNewCake)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), updateCake)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteCake);

router.route('/:id').get(getCake);

export default router;
