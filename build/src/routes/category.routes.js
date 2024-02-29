"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const require_1 = require("./../middleware/require");
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
router.get('/', category_controller_1.getAllCategories);
router.post('/', require_1.checkUserRole, category_controller_1.createNewCategory);
router.put('/', require_1.checkUserRole, category_controller_1.editCategory);
router.delete('/', require_1.checkUserRole, category_controller_1.deleteCategory);
exports.default = router;
