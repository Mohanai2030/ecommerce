import dotenv from 'dotenv'
import {prisma} from './lib/prisma.js'
import express from 'express';

dotenv.config();

const app = express();

app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
})


