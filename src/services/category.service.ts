import { Category, PrismaClient, Product } from "@prisma/client";

// Create a Prisma client instance
const prisma = new PrismaClient();

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
            // Fetch all categories from the database
            const categories: Category[] = await prisma.category.findMany();
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