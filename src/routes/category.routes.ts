import express from "express";
import { createNewCategory, deleteCategory, editCategory, getAllCategories } from "../controllers/category.controller";


const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createNewCategory);
router.put('/', editCategory);
router.delete('/', deleteCategory);

export default router;