import express from "express";
import config from 'config';
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import logger from './utils/logger';



const port = config.get<number>('port');
const origin = config.get<string>('origin');


const app = express();

app.get("/api", (req,res)=>{
    const ip = req.ip;
    res.send(`myip, ${ip}`)
})


app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());




const server = http.createServer(app);


server.listen(port, () => {
    logger.info(`Server listening at ${origin}:${port}/`);
}) 
