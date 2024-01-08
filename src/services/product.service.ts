import { PrismaClient, Product } from "@prisma/client";
import { Request, Response } from 'express';
import { createNewProduct } from '../controllers/product.controller';

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



/**
 * Data structure for creating a new product.
 */
interface CreateNewProductData {
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
}

export const CreateNewProductService = {
    /**
     * Creates a new product in the database.
     * @param newProductData - The data for the new product.
     * @returns A promise that resolves to the created product.
     * @throws {Error} Throws an error if there's an issue creating the product.
     */
    createNewProduct: async (newProductData: CreateNewProductData): Promise<Product> => {
        try{
            // newProduct.category is the passed category name
            const existingCategory = await prisma.category.findUnique({
                where: { id: newProductData.categoryId },
            });

            if(!existingCategory){
                throw new Error(`Category with id ${newProductData.categoryId} not found.`);
            }

            const createdProduct = await prisma.product.create({
                data: {
                    name: newProductData.name,
                    description: newProductData.description,
                    price: newProductData.price,
                    images: newProductData.images,
                    category: {
                        connect: { id: newProductData.categoryId },
                    },
                },
            });
        return createdProduct;

            
        }catch(error: any){
            throw new Error(`Error creating product: ${error.message}`);
        }
    }
};

