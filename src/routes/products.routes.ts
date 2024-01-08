import express from "express";
import { createNewProduct, getAllProducts } from "../controllers/product.controller";


const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createNewProduct);

export default router;