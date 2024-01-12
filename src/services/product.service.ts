import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Service responsible for handling product-related operations.
 */

export const GetAllProductService = {
    /**
     * Retrieves all products from the database, sorted by creation date in ascending order.
     * @returns A promise that resolves to an array of products.
     * @throws {Error} Throws an error if there's an issue fetching the products.
     */
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const products: Product[] = await prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc',
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




export const GetSpecificProductService = {
    /**
     * Retrieves a specific product from the database based on its ID.
     * @param productId - The ID of the product to retrieve.
     * @returns A promise that resolves to the specific product or null if not found.
     * @throws {Error} Throws an error if there's an issue fetching the product.
     */
    getSpecificProduct: async (productId: string): Promise<Product | null> => {
        try {
            const product: Product | null = await prisma.product.findUnique({
                where: { id: productId },
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error fetching specific product: ${error.message}`);
        }
    },
};

export const getCategoryProductService = {
    /**
     * Retrieves products belonging to a given category.
     * @param categoryId - The ID of the category to retrieve products from.
     * @returns A promise that resolves to an array of products or null if not found.
     * @throws {Error} Throws an error if there's an issue fetching the products.
     */
    getProductFromCategory: async (categoryId: string): Promise<Product[] | null> => {
        try {
            // Query the database to fetch products for the specified category.
            const products: Product[] | null = await prisma.product.findMany({
                where: { categoryId: categoryId },
            });

            return products;

        } catch (error: any) {
            throw new Error(`Error fetching products from the category: ${error.message}`);
        }
    },
};