import express from 'express';
import {
  getAll,
  createNew,
  update,
  deleteItem,
  getOne,
} from '../../controllers/korzhiController.js';
import { ROLES_LIST } from '../../config/roles.js';
import { verifyRoles } from '../../middleware/verifyRoles.js';
import { verifyJWT } from '../../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .get(getAll)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), createNew)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), update)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteItem);

router.route('/:id').get(getOne);

export default router;
