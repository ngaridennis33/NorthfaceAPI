import express from 'express'
import { requireUser } from '../middleware/require';
import { getAllUsersHandler, getMeHandler, updateUserHandler } from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';



const router = express.Router();

router.use(deserializeUser,requireUser);

router.get('/me', getMeHandler);
router.get('/', getAllUsersHandler);
router.put('/id', updateUserHandler);
router.delete('/delete/:id');

export default router;