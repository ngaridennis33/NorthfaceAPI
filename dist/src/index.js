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
require('dotenv').config();
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./utils/logger"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
(0, validateEnv_1.default)();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Body Parser
        app.use(express_1.default.json());
        // 2. Cookie parser
        app.use((0, cookie_parser_1.default)());
        // 3. Cors
        app.use((0, cors_1.default)({
            credentials: true,
        }));
        // 4. Compression
        app.use((0, compression_1.default)());
        // 5. Logger
        //TEMPLATE ENGINE
        app.set('view engine', 'pug');
        app.set('views', `${__dirname}/views`);
        // ROUTES
        app.use('/api/products', products_routes_1.default);
        app.use('/api/products', products_routes_1.default);
        app.use('/api/categories', category_routes_1.default);
        app.use('/api/auth', auth_routes_1.default);
        app.use('/api/users', user_routes_1.default);
        // 6. Testing
        app.get('/api/healthchecker', (_, res) => {
            res.status(200).json({
                status: 'success',
                message: 'Welcome to NodeJs with Prisma and PostgreSQL',
            });
        });
        // UNHANDLED ROUTES
        app.all("*", (req, res) => {
            res.status(404).json({ error: `Route ${req.originalUrl} not found` });
        });
        // PORT
        const port = config_1.default.get('port');
        const origin = config_1.default.get('origin');
        const server = http_1.default.createServer(app);
        server.listen(port, () => {
            logger_1.default.info(`Server listening at ${origin}:${port}`);
        });
    });
}
bootstrap()
    .catch((err) => {
    throw err;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=index.js.map