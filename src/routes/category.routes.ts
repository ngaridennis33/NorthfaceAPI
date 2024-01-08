import express from "express";
import { createNewCategory, getAllCategories } from "../controllers/category.controller";


const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createNewCategory);

export default router;