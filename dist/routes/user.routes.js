"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const require_1 = require("../middleware/require");
const user_controller_1 = require("../controllers/user.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const router = express_1.default.Router();
router.use(deserializeUser_1.deserializeUser, require_1.requireUser);
router.get('/me', user_controller_1.getUserHandler);
router.put('/id', user_controller_1.updateUserHandler);
exports.default = router;
//# sourceMappingURL=user.routes.js.map