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
exports.signTokens = exports.getAllUsersService = exports.updateUserService = exports.findUserService = exports.findUniqueUserService = exports.createUserService = exports.excludedFields = void 0;
const connectRedis_1 = __importDefault(require("./../utils/connectRedis"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("config"));
const jwt_1 = require("../utils/jwt");
exports.excludedFields = [
    "password",
    "verified",
    "verificationCode",
    "passwordResetAt",
    "passwordResetToken",
];
const prisma = new client_1.PrismaClient();
const createUserService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.create({
        data: input,
    }));
});
exports.createUserService = createUserService;
const findUniqueUserService = (where, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.findUnique({
        where,
        select,
    }));
});
exports.findUniqueUserService = findUniqueUserService;
const findUserService = (where, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.findFirst({
        where,
        select,
    }));
});
exports.findUserService = findUserService;
const updateUserService = (where, data, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.update({ where, data, select }));
});
exports.updateUserService = updateUserService;
// TODO: Update to get all the users
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.findMany());
});
exports.getAllUsersService = getAllUsersService;
const signTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Create Session
    connectRedis_1.default.set(`${user.id}`, JSON.stringify(user), {
        EX: config_1.default.get('redisCacheExpiresIn') * 60,
    });
    // 2. Create access and refresh Tokens.
    const access_token = (0, jwt_1.signJwt)({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
    });
    const refresh_token = (0, jwt_1.signJwt)({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config_1.default.get('refreshTokenExpiresIn')}m`,
    });
    return { access_token, refresh_token };
});
exports.signTokens = signTokens;
//# sourceMappingURL=user.service.js.map