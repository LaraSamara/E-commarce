import dotenv from 'dotenv';
dotenv.config();
import express  from "express";
import { initApp } from "./src/module/app.router.js";
const port = process.env.PORT||3000;
const app = express();
initApp(express,app);
app.listen(port);