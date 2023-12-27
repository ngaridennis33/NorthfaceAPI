require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import express from "express";
import config from 'config';
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import connectRedis from "./utils/connectRedis";

const app = express();
app.use(express.json())


const prisma = new PrismaClient();

const port = config.get<number>('port');
const origin = config.get<string>('origin');


app.get("/api/users", async (req,res)=>{
    const allusers = await prisma.user.findMany();
    res.json(allusers);
})

// Create a new user
app.post("/api/users", async (req,res)=>{
    const newUser = await prisma.user.create({data: req.body })
    res.json(newUser);
})



app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());




const server = http.createServer(app);


server.listen(port, () => {
    console.log(`Server listening at ${origin}:${port}/`);
    connectRedis();
}) 
