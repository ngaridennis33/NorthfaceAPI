"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = exports.requireUser = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const requireUser = (req, res, next) => {
    try {
        const user = res.locals.user;
        if (!user) {
            return next(new appError_1.default(400, `Session has expired or user doesn't exist`));
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.requireUser = requireUser;
const checkUserRole = (req, res, next) => {
    var _a;
    // TODO: Authenticate and Authorize on the Server:
    const userRole = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.role;
    if (userRole === 'Admin') {
        next();
    }
    else {
        next(new appError_1.default(403, 'Forbidden!'));
    }
};
exports.checkUserRole = checkUserRole;
//# sourceMappingURL=require.js.map