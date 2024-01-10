import { Category } from '@prisma/client';
import { Request, Response } from "express";
import {
    GetAllProductService,
    CreateNewProductService,
    GetSpecificProductService,
    getCategoryProductService,
} from "../services/product.service";
import { GetCategoryIdService } from '../services/category.service';

/**
 * Creates a new product based on the data in the request body.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON response with the created product.
 */
export const createNewProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, categorySlug, price, images } = req.body;

        // Call the CategoryService to get the category ID by name
        const categoryId = await GetCategoryIdService.getCategoryIdBySlug(categorySlug);
        if (!categoryId) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

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
        const sortedProducts = await GetAllProductService.getAllProducts();
        res.status(200).json(sortedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Retrieve a specific product from the database.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
export const getSpecificProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId:string = req.params.prodId; // Assuming the product id is in the route parameters

        if (!productId) {
            res.status(400).json({ error: "Product ID is missing in the request parameters" });
            return;
        }

        const specificProduct = await GetSpecificProductService.getSpecificProduct(productId);

        if (!specificProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json(specificProduct);
    } catch (error) {
        console.error("Error fetching specific product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Retrieve products from a specific category.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
export const getProductFromCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract the category ID from the route parameters.
        const categoryId: string = req.params.catId;

        // Check if the category ID is missing in the request parameters.
        if (!categoryId) {
            res.status(400).json({ error: "Category ID is missing in the request parameters" });
            return;
        }

        // Call the service to retrieve products for the specified category.
        const categoryProducts = await getCategoryProductService.getProductFromCategory(categoryId);

        // Check if the category or products are not found.
        if (!categoryProducts) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        // Respond with the products from the specified category.
        res.status(200).json(categoryProducts);

    } catch (error) {
        console.error("Error fetching products from the category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Product

// Edit a product

// Edit product Images

// search product name, order by price, ascending, in category

// Add Images to products

// Delete images to products




