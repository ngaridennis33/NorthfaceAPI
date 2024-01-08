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



    // UNHANDLED ROUTES
    app.all("*", (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
        });

    // PORT
    const server = http.createServer(app);
    server.listen(port, () => {
        log.info(`Server listening at ${origin}:${port}`);
        connectRedis();
    }) 
}

bootstrap()





