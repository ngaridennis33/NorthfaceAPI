"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const require_1 = require("./../middleware/require");
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const deserializeUser_1 = require("./../middleware/deserializeUser");
const router = express_1.default.Router();
router.get('/', category_controller_1.getAllCategories);
router.post('/', deserializeUser_1.deserializeUser, require_1.requireUser, require_1.checkUserRole, category_controller_1.createNewCategory);
router.put('/', deserializeUser_1.deserializeUser, require_1.requireUser, require_1.checkUserRole, category_controller_1.editCategory);
router.delete('/', deserializeUser_1.deserializeUser, require_1.requireUser, require_1.checkUserRole, category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map