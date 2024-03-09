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
exports.getAllUsers = exports.updateUserHandler = exports.getUserHandler = void 0;
const user_service_1 = require("../services/user.service");
const lodash_1 = require("lodash"); // used to create a new object that omits specified properties from an existing object for security eg password.
const appError_1 = __importDefault(require("../utils/appError"));
//Get logged in user
const getUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        res.status(200).status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserHandler = getUserHandler;
// Update User Profile
const updateUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        const { name, email } = req.body;
        // Update the user data with defined fields.
        const userData = {};
        if (name !== undefined)
            userData.name = name;
        // TODO Send the verification code to the new email set
        if (email !== undefined)
            userData.email = email;
        const updatedUserData = yield (0, user_service_1.updateUserService)({ id: user.id }, userData);
        const newUser = (0, lodash_1.omit)(updatedUserData, user_service_1.excludedFields);
        res.status(200).json(newUser);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateUserHandler = updateUserHandler;
// Get all users
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.getAllUsersService)();
        if (!users) {
            return next(new appError_1.default(401, 'Forbidden'));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
// create session
// get sessions
// Delelete sessions 
// login
// Get user profile
// logout
// Delete user
//# sourceMappingURL=user.controller.js.map