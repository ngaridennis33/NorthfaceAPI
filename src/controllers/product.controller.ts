import { Request, Response } from "express";
import {
    GetProductService,
    CreateNewProductService,
} from "../services/product.service";

/**
 * Creates a new product based on the data in the request body.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON response with the created product.
 */
export const createNewProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, categoryId, price, images } = req.body;

        // Call the ProductService to create the product
        const createdProduct = await CreateNewProductService.createNewProduct({
            name,
            description,
            images,
            price,
            categoryId
        });

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating new product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Retrieves all products from the database, sorted by date in ascending order.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON array containing the sorted products.
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const sortedProducts = await GetProductService.getAllProducts();
        res.json(sortedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
