import { Category } from '@prisma/client';
import { Request, Response } from "express";
import { createNewCategoryService, deleteCategoryService, getCategoriesService, updateCategoryService } from "../services/category.service";

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



/**
 * Edits an existing category based on the data in the request body.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
interface UpdateCategoryData {
    title?: string;
    desc?: string;
    img?: string[];
}
export const editCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const catSlug = req.body.slug; // Assuming the category ID is part of the request parameters
        const { title, desc, img } = req.body;

        // Prepare updated category data with defined fields from the request body
        const updatedCategoryData: Partial<UpdateCategoryData> = {};
        if (title !== undefined) updatedCategoryData.title = title;
        if (desc !== undefined) updatedCategoryData.desc = desc;
        if (img !== undefined) updatedCategoryData.img = img;
        
        const updatedCategory = await updateCategoryService.updateCategory(catSlug,updatedCategoryData);

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Deletes an existing category based on the categoryId.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.body;

        // Call the category service to handle the deletion of the category
        const deletedCategory = await deleteCategoryService.deleteCategory(slug);

        if (deletedCategory) {
            res.status(200).json({ message: "Category deleted", deletedCategory });
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        console.error('Error Deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

