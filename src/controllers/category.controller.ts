import { Request, Response } from "express";
import { createNewCategoryService, getCategoriesService } from "../services/category.service";

/**
 * Retrieves all categories from the database.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON response with an array containing all categories.
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const allCategories = await getCategoriesService.getAllCategories();
        res.json(allCategories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Creates a new category based on the data in the request body.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
export const createNewCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, desc, img } = req.body;

        // Function to generate a unique catSlug
        const generateCategorySlug = (categoryName: string): string => {
            const sanitizedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-');
            const uniqueSuffix = Date.now().toString(36);
            return `${sanitizedCategoryName}-${uniqueSuffix}`;
        };

        // Create the catSlug
        const slug = generateCategorySlug(title);

        // Call the Category service to create the new category
        const createdCategory = await createNewCategoryService.createNewCategory({
            title,
            desc,
            img,
            slug,
        });

        res.status(201).json(createdCategory);
    } catch (error) {
        console.error("Error creating new category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};