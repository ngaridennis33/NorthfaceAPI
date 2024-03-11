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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoryIdService = exports.deleteCategoryService = exports.updateCategoryService = exports.getCategoriesService = exports.createNewCategoryService = void 0;
const client_1 = require("@prisma/client");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
// Create a Prisma client instance
const prisma = new client_1.PrismaClient();
// Service to create a new category
const createNewCategoryService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.category.create({
        data: input,
    }));
});
exports.createNewCategoryService = createNewCategoryService;
/**
 * Service responsible for handling category-related operations.
 */
// Service to get all categories
exports.getCategoriesService = {
    /**
     * Retrieves all categories from the database.
     * @returns A promise that returns all categories.
     * @throws {Error} Throws an error if there's an issue fetching the categories.
     */
    getAllCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if the categories are in the redis cache and return them.
            const cachedCategories = yield connectRedis_1.default.get('categories');
            if (cachedCategories) {
                // Return cached categories if available
                return JSON.parse(cachedCategories);
            }
            // Fetch all categories from the database
            const categories = yield prisma.category.findMany();
            // Save the categories in the redis cache.
            yield connectRedis_1.default.set('categories', JSON.stringify(categories));
            return categories;
        }
        catch (error) {
            // Handle errors and throw a meaningful error message
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    }),
};
// Service to Update a category
exports.updateCategoryService = {
    /**
     * Updates an existing category in the database.
     * @param categoryId - The ID of the category to be updated.
     * @param updatedCategoryData - The updated data for the category.
     * @returns A promise that resolves to the updated category.
     * @throws {Error} Throws an error if there's an issue updating the category.
     */
    updateCategory: (catSlug, updatedCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedCategory = yield prisma.category.update({
                where: { slug: catSlug },
                data: updatedCategoryData,
            });
            return updatedCategory;
        }
        catch (error) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    }),
};
// Service to delete a category
exports.deleteCategoryService = {
    /**
     * Deletes a category from the database.
     * @param catSlug - The unique category slug for the category to be deleted.
     * @returns A promise that resolves to the deleted category, or null if not found.
     * @throws {Error} Throws an error if there is an issue deleting the category.
     */
    deleteCategory: (catSlug) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if the category exists before attempting to delete
            const existingCategory = yield prisma.category.findUnique({
                where: { slug: catSlug },
            });
            if (!existingCategory) {
                console.log("Category does not exist");
                return null;
            }
            // Delete the category
            const deletedCategory = yield prisma.category.delete({
                where: { slug: catSlug },
            });
            return deletedCategory;
        }
        catch (error) {
            // Handle errors, log them, and rethrow for higher-level handling
            console.error(`Error deleting category: ${error.message}`);
            throw new Error(`Error deleting category: ${error.message}`);
        }
    }),
};
exports.GetCategoryIdService = {
    getCategoryIdBySlug: (categorySlug) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const category = yield prisma.category.findUnique({
                where: { slug: categorySlug },
            });
            return (category === null || category === void 0 ? void 0 : category.id) || null;
        }
        catch (error) {
            throw new Error(`Error fetching category ID: ${error.message}`);
        }
    }),
};
//# sourceMappingURL=category.service.js.map