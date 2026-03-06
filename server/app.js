import dotenv from 'dotenv'
import {prisma} from './lib/prisma.js'
import express from 'express';
import { userRouter } from './router/userRouter.js';
import { adminRouter } from './router/adminRouter.js';
import { deliverypartnerRouter } from './router/deliverypartnerRouter.js';
import { connectRedis, redisClient } from './config/redis.js';
import { resolve } from 'path';

dotenv.config();

const app = express();

function headerCheck(req){
    console.log("headers auth: ",req.headers?.['authorization'])
}

function wait(seconds){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },seconds*1000);
    })
}

app.get('/',async(req,res)=>{
    return res.send("hello world");
})

app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/deliverypartner',deliverypartnerRouter);


app.listen(process.env.PORT,async()=>{
    console.log(`server running on ${process.env.PORT}`);
    connectRedis();
})


