import { createNewProduct } from './../controllers/product.controller';
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Service responsible for handling product-related operations.
 */

export const GetProductService = {
    /**
     * Retrieves all products from the database, sorted by creation date in ascending order.
     * @returns A promise that resolves to an array of products.
     * @throws {Error} Throws an error if there's an issue fetching the products.
     */
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const products: Product[] = await prisma.product.findMany({
                orderBy: {
                    createdAt: 'asc',
                },
            });

            return products;
        } catch (error: any) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    },
};


export const CreateNewProductService = {
    /**
     * Creates a new product in the database.
     * @param newProductData - The data for the new product.
     * @returns A promise that resolves to the created product.
     * @throws {Error} Throws an error if there's an issue creating the product.
     */
    createNewProduct: async (newProductData: Partial<Product>): Promise<Product> => {
        try {
            const createdProduct = await prisma.product.create({
                data: newProductData,
            });

            return createdProduct;
        } catch (error: any) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }
}

