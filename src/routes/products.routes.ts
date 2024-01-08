import express from "express";
import { getAllProducts } from "../controllers/product.controller";


const router = express.Router();

router.get('/', getAllProducts);

export default router;