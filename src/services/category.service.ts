import { Category, PrismaClient } from "@prisma/client";
import { redisClient } from "../utils/connectRedis";


// Create a Prisma client instance
const prisma = new PrismaClient();

// Initialize your Redis client


/**
 * Service responsible for handling category-related operations.
 */

// Service to get all categories
export const getCategoriesService = {
    /**
     * Retrieves all categories from the database.
     * @returns A promise that returns all categories.
     * @throws {Error} Throws an error if there's an issue fetching the categories.
     */
    getAllCategories: async (): Promise<Category[]> => {
        try {

            // Check if the categories are in the redis cache and return them.
            const cachedCategories = await redisClient.get('categories');
            if (cachedCategories) {
            // Return cached categories if available
                return JSON.parse(cachedCategories);
            }

            // Fetch all categories from the database
            const categories: Category[] = await prisma.category.findMany();

            // Save the categories in the redis cache.
            await redisClient.set('categories', JSON.stringify(categories));

            return categories;
        } catch (error: any) {
            // Handle errors and throw a meaningful error message
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    },
};

// Define the data structure for creating a new category
export interface CreateNewCategoryData {
    title: string;
    desc: string;
    img: string[];
    slug: string;
}

// Service to create a new category
export const createNewCategoryService = {
    /**
     * Creates a new category in the database.
     * @param newCategoryData - The data for the new category.
     * @returns A promise that resolves to the created category.
     * @throws {Error} Throws an error if there's an issue creating the category.
     */
    createNewCategory: async (newCategoryData: CreateNewCategoryData): Promise<Category> => {
        try {
            // Create a new category using Prisma client
            const createdCategory = await prisma.category.create({
                data: newCategoryData,
            });
            
            return createdCategory;
            
        } catch (error: any) {
            // Handle errors and throw a meaningful error message
            throw new Error(`Error creating category: ${error.message}`);
        }
    },
};


// Service to Update a category
export const updateCategoryService = {
    /**
     * Updates an existing category in the database.
     * @param categoryId - The ID of the category to be updated.
     * @param updatedCategoryData - The updated data for the category.
     * @returns A promise that resolves to the updated category.
     * @throws {Error} Throws an error if there's an issue updating the category.
     */
    updateCategory: async (catSlug: string, updatedCategoryData: Partial<Category>): Promise<Category> => {
        try {
            const updatedCategory = await prisma.category.update({
                where: { slug: catSlug },
                data: updatedCategoryData,
            });

            return updatedCategory;
        } catch (error: any) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    },
};

// Service to delete a category
export const deleteCategoryService = {
    /**
     * Deletes a category from the database.
     * @param catSlug - The unique category slug for the category to be deleted.
     * @returns A promise that resolves to the deleted category, or null if not found.
     * @throws {Error} Throws an error if there is an issue deleting the category.
     */
    deleteCategory: async (catSlug: string): Promise<Category | null> => {
        try {
            // Check if the category exists before attempting to delete
            const existingCategory = await prisma.category.findUnique({
                where: { slug: catSlug },
            });

            if (!existingCategory) {
                console.log("Category does not exist");
                return null;
            }

            // Delete the category
            const deletedCategory = await prisma.category.delete({
                where: { slug: catSlug },
            });

            return deletedCategory;
        } catch (error: any) {
            // Handle errors, log them, and rethrow for higher-level handling
            console.error(`Error deleting category: ${error.message}`);
            throw new Error(`Error deleting category: ${error.message}`);
        }
    },
};

export const GetCategoryIdService = {
getCategoryIdBySlug: async (categorySlug: string): Promise<string | null> => {
    try {
    const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
    });

    return category?.id || null;
    } catch (error:any) {
    throw new Error(`Error fetching category ID: ${error.message}`);
    }
},
};