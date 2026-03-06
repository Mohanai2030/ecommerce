import express from 'express';
import {prisma} from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import {roles} from '../constants/roles.js'
import { accessTokenSign, refreshTokenSign, refreshTokenVerify } from '../services/jwt.js';
import { redisClient } from '../config/redis.js';
import cookieParser from 'cookie-parser';

const userRouter = express.Router();

userRouter.post('/register',async(req,res)=>{
    const {name,phone,password} = req.body();

    try{    
        const hashedPassword = await bcrypt.hash(password,10);

        const registeredUser = await prisma.usertable.create({
            data:{
                username:name,
                phone:phone,
                userpassword:hashedPassword,
            }
        });

        return res.status(200).json({
            userId:registeredUser.userid,
        });

    }catch(err){
        return res.status(500);
    }
    
})

userRouter.post('/login',async(req,res)=>{

    const {name,phone,password} = req.body;


    try{

        const loginUser = await prisma.usertable.findUnique({
            where:{
                phone:phone,
                username:name,
            }
        });
        
        const isPasswordMatching = await bcrypt.compare(password,loginUser.userpassword);

        if(!isPasswordMatching){
            return res.status(400);
        }

        const refreshTokenPayload = {
            'role':roles.user,
            'id':loginUser.userid
        };

        const accessTokenPayload = {
            'role':roles.user,
            'id':loginUser.userid
        };

        const refreshToken = await refreshTokenSign(refreshTokenPayload);
        const accessToken = await accessTokenSign(accessTokenPayload);

        if(!refreshToken || !accessToken){
            return res.status(500);
        }

        await redisClient.set(`user:${loginUser.userid}`,refreshToken,{expiration:{type:'EX',value:60*60*24}});

        res.cookie('refreshToken',refreshToken,{httpOnly:true,expires:'1d'});
        return res.status(200).json({
            'role':'user',
            'accessToken':accessToken,
        });

    }catch(err){
        return res.status(500)
    }
})

userRouter.get('/refresh',cookieParser,async(req,res)=>{
    const userRefreshToken = req.cookies?.['refreshToken'];

    if(!userRefreshToken){
        return res.status(400);
    }

    const isTokenValid = refreshTokenVerify(userRefreshToken);

    if(!isTokenValid){
        return res.status(400);
    }

    try{
        const userRefreshTokenStored = await redisClient.get(`user:${isTokenValid.id}`);
        if(userRefreshTokenStored==null){
            return res.status(400);
        }
        
        const newAccessToken = await accessTokenSign(userRefreshToken);

        return res.status(200).json(newAccessToken);
    }catch(err){
        return res.status(400);
    }

})

export {userRouter};