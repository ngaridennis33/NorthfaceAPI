import express from "express";
import { createNewCategory, editCategory, getAllCategories } from "../controllers/category.controller";


const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createNewCategory);
router.put('/', editCategory);

export default router;