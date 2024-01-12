import { Category } from '@prisma/client';
require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from "express";
import config from 'config';
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import connectRedis from "./utils/connectRedis";
import log from "./utils/logger";
import productRouter from "./routes/products.routes";
import CategoryRouter from "./routes/category.routes";
import AuthRouter from "./routes/auth.routes";
import redisClient from './utils/connectRedis';

const app = express();
app.use(express.json())


const prisma = new PrismaClient();

const port = config.get<number>('port');
const origin = config.get<string>('origin');


app.use(cors({
    credentials: true,
}))



app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


async function bootstrap(){
    // ROUTES
    app.use('/api/products', productRouter);
    app.use('/api/products', productRouter);
    app.use('/api/categories', CategoryRouter);
    app.use('/api/auth', AuthRouter);



    // UNHANDLED ROUTES
    app.all("*", (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
        });

    // PORT
    const server = http.createServer(app);
    server.listen(port, () => {
        log.info(`Server listening at ${origin}:${port}`);
    });
}

bootstrap()
.catch((err) => {
    throw err;
})
.finally(async () => {
    await prisma.$disconnect();
});





