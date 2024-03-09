"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const validate_1 = require("../middleware/validate");
const user_schema_1 = require("../schema/user.schema");
const require_1 = require("../middleware/require");
const deserializeUser_1 = require("../middleware/deserializeUser");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.validate)(user_schema_1.registerUserSchema), auth_controllers_1.registerUserHandler);
router.post('/login', (0, validate_1.validate)(user_schema_1.loginUserSchema), auth_controllers_1.loginUserHandler);
router.post('/refresh', auth_controllers_1.refreshAccessTokenHandler);
router.get('/logout', deserializeUser_1.deserializeUser, require_1.requireUser, auth_controllers_1.logoutUserHandler);
router.get('/verifyemail/:verificationCode', (0, validate_1.validate)(user_schema_1.verifyEmailSchema), auth_controllers_1.verifyEmailHandler);
router.post('/forgotpassword', (0, validate_1.validate)(user_schema_1.forgotPasswordSchema), auth_controllers_1.forgotPasswordHandler);
router.patch('/resetpassword/:resetToken', (0, validate_1.validate)(user_schema_1.resetPasswordSchema), auth_controllers_1.resetPasswordHandler);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map