import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);


app.use(express.json({ limit: "1600mb" }));


app.use(express.urlencoded({ extended: true, limit: "1600mb" }));


app.use(express.static("public"));


app.use(cookieParser());

// Routes is start from here 
import allroutes from './routes/index.js'
app.use('/',allroutes);




export { app };
