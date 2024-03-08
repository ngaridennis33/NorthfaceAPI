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
exports.getCategoryProductService = exports.GetSpecificProductService = exports.CreateNewProductService = exports.GetAllProductService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Service responsible for handling product-related operations.
 */
exports.GetAllProductService = {
    /**
     * Retrieves all products from the database, sorted by creation date in ascending order.
     * @returns A promise that resolves to an array of products.
     * @throws {Error} Throws an error if there's an issue fetching the products.
     */
    getAllProducts: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return products;
        }
        catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }),
};
exports.CreateNewProductService = {
    /**
     * Creates a new product in the database.
     * @param newProductData - The data for the new product.
     * @returns A promise that resolves to the created product.
     * @throws {Error} Throws an error if there's an issue creating the product.
     */
    createNewProduct: (newProductData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // newProduct.category is the passed category name
            const existingCategory = yield prisma.category.findUnique({
                where: { id: newProductData.categoryId },
            });
            if (!existingCategory) {
                throw new Error(`Category with id ${newProductData.categoryId} not found.`);
            }
            const createdProduct = yield prisma.product.create({
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
        }
        catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    })
};
exports.GetSpecificProductService = {
    /**
     * Retrieves a specific product from the database based on its ID.
     * @param productId - The ID of the product to retrieve.
     * @returns A promise that resolves to the specific product or null if not found.
     * @throws {Error} Throws an error if there's an issue fetching the product.
     */
    getSpecificProduct: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield prisma.product.findUnique({
                where: { id: productId },
            });
            return product;
        }
        catch (error) {
            throw new Error(`Error fetching specific product: ${error.message}`);
        }
    }),
};
exports.getCategoryProductService = {
    /**
     * Retrieves products belonging to a given category.
     * @param categoryId - The ID of the category to retrieve products from.
     * @returns A promise that resolves to an array of products or null if not found.
     * @throws {Error} Throws an error if there's an issue fetching the products.
     */
    getProductFromCategory: (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Query the database to fetch products for the specified category.
            const products = yield prisma.product.findMany({
                where: { categoryId: categoryId },
            });
            return products;
        }
        catch (error) {
            throw new Error(`Error fetching products from the category: ${error.message}`);
        }
    }),
};
