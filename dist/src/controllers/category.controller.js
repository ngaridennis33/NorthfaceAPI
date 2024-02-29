"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.editCategory = exports.createNewCategory = exports.getAllCategories = void 0;
const category_service_1 = require("../services/category.service");
/**
 * Retrieves all categories from the database.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON response with an array containing all categories.
 */
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCategories = yield category_service_1.getCategoriesService.getAllCategories();
        res.json(allCategories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllCategories = getAllCategories;
/**
 * Creates a new category based on the data in the request body.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
const createNewCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, desc, img } = req.body;
        // Function to generate a unique catSlug
        const generateCategorySlug = (categoryName) => {
            const sanitizedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-');
            const uniqueSuffix = Date.now().toString(36);
            return `${sanitizedCategoryName}-${uniqueSuffix}`;
        };
        // Create the catSlug
        const slug = generateCategorySlug(title);
        // Call the Category service to create the new category
        const createdCategory = yield category_service_1.createNewCategoryService.createNewCategory({
            title,
            desc,
            img,
            slug,
        });
        res.status(201).json(createdCategory);
    }
    catch (error) {
        console.error("Error creating new category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createNewCategory = createNewCategory;
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catSlug = req.body.slug; // Assuming the category ID is part of the request parameters
        const { title, desc, img } = req.body;
        // Prepare updated category data with defined fields from the request body
        const updatedCategoryData = {};
        if (title !== undefined)
            updatedCategoryData.title = title;
        if (desc !== undefined)
            updatedCategoryData.desc = desc;
        if (img !== undefined)
            updatedCategoryData.img = img;
        const updatedCategory = yield category_service_1.updateCategoryService.updateCategory(catSlug, updatedCategoryData);
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.editCategory = editCategory;
/**
 * Deletes an existing category based on the categoryId.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.body;
        // Call the category service to handle the deletion of the category
        const deletedCategory = yield category_service_1.deleteCategoryService.deleteCategory(slug);
        if (deletedCategory) {
            res.status(200).json({ message: "Category deleted", deletedCategory });
        }
        else {
            res.status(404).json({ error: "Category not found" });
        }
    }
    catch (error) {
        console.error('Error Deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map