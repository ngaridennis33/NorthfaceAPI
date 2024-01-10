import express from "express";
import { createNewProduct, getAllProducts, getProductFromCategory, getSpecificProduct } from "../controllers/product.controller";


const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createNewProduct);
router.get('/:prodId', getSpecificProduct);
router.get('/categories/:catId', getProductFromCategory);

export default router;