import express from 'express';
import { prisma } from '../../lib/prisma.js';
import { roles } from '../../constants/roles.js';
import { accessTokenSign, refreshTokenSign } from '../../services/jwt.js';
import cookieParser from 'cookie-parser';
import { redisClient } from '../../config/redis.js';
const adminAuthRouter = express.Router();

adminAuthRouter.post('/login',async(req,res)=>{
    const {name,phone,password} = req.body;
    
    try{
        const loginAdmin = await prisma.admin.findUnique({
            where:{
                phone:phone,
                adminname:name,
            }
        });

        const isPasswordMatching = await bcrypt.compare(password,loginAdmin.adminpassword);

        if(!isPasswordMatching){
            return res.status(400);
        }

        const refreshTokenPayload = {
            'role':roles.admin,
            'id':loginAdmin.adminid
        };

        const accessTokenPayload = {
            'role':roles.admin,
            'id':loginAdmin.adminid
        }

        const refreshToken = await refreshTokenSign(refreshTokenPayload,'admin');
        const accessToken = await accessTokenSign(accessTokenPayload,'admin');
             
        if(!refreshToken || !accessToken){
            return res.status(500);
        }

        await redisClient.set(`admin:${loginUser.userid}`,refreshToken,{expiration:{type:'EX',value:60*60*12}});

        res.cookie('refreshToken',refreshToken,{httpOnly:true,expires:'12h'});
        return res.status(200).json({
            'role':'user',
            'accessToken':accessToken,
        });

    }catch(err){
        return res.status(500)
    }
})

adminAuthRouter.get('/refresh',cookieParser,async(req,res)=>{
    const adminRefreshToken = req.cookies?.['refreshToken'];

    if(!adminRefreshToken){
        return res.status(400);
    }

    const isTokenValid = refreshTokenVerify(adminRefreshToken);

    if(!isTokenValid){
        return res.status(400);
    }

    try{
        const adminRefreshTokenStored = await redisClient.get(`admin:${isTokenValid.id}`);
        if(adminRefreshTokenStored==null){
            return res.status(400);
        }
        
        const newAccessToken = await accessTokenSign(adminRefreshToken,'admin');

        return res.status(200).json(newAccessToken);
    }catch(err){
        return res.status(400);
    }
})

adminAuthRouter.delete('/login',cookieParser,async(req,res)=>{
    const adminRefreshToken = req.cookies?.['refreshToken'];

    if(!adminRefreshToken){
        return res.status(400);
    }

    const isTokenValid = refreshTokenVerify(adminRefreshToken);

    try{
        res.clearCookie('refreshToken',{httpOnly:true,expires:'1d'});
        await redisClient.del(`admin:${isTokenValid.id}`)
        return res.json(200)
    }catch(err){
        return res.status(500)
    }
})

export {adminAuthRouter};