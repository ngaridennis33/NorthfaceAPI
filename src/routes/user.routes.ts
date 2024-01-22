import express from 'express'
import { requireUser } from '../middleware/require';
import { getUserHandler, updateUserHandler } from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';


const router = express.Router();

router.use(deserializeUser,requireUser);

router.get('/me', getUserHandler);
router.put('/id', updateUserHandler);

export default router;