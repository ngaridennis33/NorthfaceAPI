import { checkUserRole, requireUser } from './../middleware/require';
import express from "express";
import { createNewCategory, deleteCategory, editCategory, getAllCategories } from "../controllers/category.controller";
import { deserializeUser } from './../middleware/deserializeUser';


const router = express.Router();

router.get('/', getAllCategories);
router.post('/',deserializeUser,requireUser,checkUserRole, createNewCategory);
router.put('/',deserializeUser,requireUser,checkUserRole, editCategory);
router.delete('/',deserializeUser,requireUser,checkUserRole, deleteCategory);

export default router;