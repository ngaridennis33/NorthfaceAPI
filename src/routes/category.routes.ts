import { checkUserRole } from './../middleware/require';
import express from "express";
import { createNewCategory, deleteCategory, editCategory, getAllCategories } from "../controllers/category.controller";


const router = express.Router();

router.get('/', getAllCategories);
router.post('/',checkUserRole, createNewCategory);
router.put('/',checkUserRole, editCategory);
router.delete('/',checkUserRole, deleteCategory);

export default router;