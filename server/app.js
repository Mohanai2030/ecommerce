import dotenv from 'dotenv'
import express from 'express';
import { userRouter } from './router/userRouter.js';
import { adminRouter } from './router/adminRouter.js';
import { deliverypartnerRouter } from './router/deliverypartnerRouter.js';
import { connectRedis, redisClient } from './config/redis.js';

dotenv.config();

const app = express();

app.get('/',async(req,res)=>{
    // let functionArray = [];
    let waitTimes = [1,4,3,2];
    waitTimes.map(waitTime => waitWrapper(waitTime));
    return res.send("hello world");
})


app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/deliverypartner',deliverypartnerRouter);


app.listen(process.env.PORT,async()=>{
    console.log(`server running on ${process.env.PORT}`);
    connectRedis();
})


