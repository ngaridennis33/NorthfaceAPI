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
exports.getProductFromCategory = exports.getSpecificProduct = exports.getAllProducts = exports.createNewProduct = void 0;
const product_service_1 = require("../services/product.service");
const category_service_1 = require("../services/category.service");
/**
 * Creates a new product based on the data in the request body.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON response with the created product.
 */
const createNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, categorySlug, price, images } = req.body;
        // Call the CategoryService to get the category ID by name
        const categoryId = yield category_service_1.GetCategoryIdService.getCategoryIdBySlug(categorySlug);
        if (!categoryId) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        // Call the ProductService to create the product
        const createdProduct = yield product_service_1.CreateNewProductService.createNewProduct({
            name,
            description,
            images,
            price,
            categoryId
        });
        res.status(201).json(createdProduct);
    }
    catch (error) {
        console.error("Error creating new product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createNewProduct = createNewProduct;
/**
 * Retrieves all products from the database, sorted by date in ascending order.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns A JSON array containing the sorted products.
 */
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortedProducts = yield product_service_1.GetAllProductService.getAllProducts();
        res.status(200).json(sortedProducts);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllProducts = getAllProducts;
/**
 * Retrieve a specific product from the database.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
const getSpecificProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.prodId; // Assuming the product id is in the route parameters
        if (!productId) {
            res.status(400).json({ error: "Product ID is missing in the request parameters" });
            return;
        }
        const specificProduct = yield product_service_1.GetSpecificProductService.getSpecificProduct(productId);
        if (!specificProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json(specificProduct);
    }
    catch (error) {
        console.error("Error fetching specific product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getSpecificProduct = getSpecificProduct;
/**
 * Retrieve products from a specific category.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
const getProductFromCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the category ID from the route parameters.
        const categoryId = req.params.catId;
        // Check if the category ID is missing in the request parameters.
        if (!categoryId) {
            res.status(400).json({ error: "Category ID is missing in the request parameters" });
            return;
        }
        // Call the service to retrieve products for the specified category.
        const categoryProducts = yield product_service_1.getCategoryProductService.getProductFromCategory(categoryId);
        // Check if the category or products are not found.
        if (!categoryProducts) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        // Respond with the products from the specified category.
        res.status(200).json(categoryProducts);
    }
    catch (error) {
        console.error("Error fetching products from the category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getProductFromCategory = getProductFromCategory;
// Delete Product
// Edit a product
// Edit product Images
// search product name, order by price, ascending, in category
// Add Images to products
// Delete images to products
