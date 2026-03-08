import express from 'express';
import { prisma } from '../../lib/prisma.js';
import { roles } from '../../constants/roles.js';
import { accessTokenSign, refreshTokenSign } from '../../services/jwt.js';
import cookieParser from 'cookie-parser';
const deliverypartnerRouter = express.Router();

deliverypartnerRouter.post('/login',async(req,res)=>{
    const {name,phone,password} = req.body;
        
    try{
        const logindeliveryPartner = await prisma.deliverypartner.findUnique({
            where:{
                phone:phone,
                deliverypartnername:name,
            }
        });

        const isPasswordMatching = await bcrypt.compare(password,logindeliveryPartner.deliverypartnerpassword);

        if(!isPasswordMatching){
            return res.status(400);
        }

        const refreshTokenPayload = {
            'role':roles.deliverypartner,
            'id':logindeliveryPartner.deliverypartnerid
        };

        const accessTokenPayload = {
            'role':roles.deliverypartner,
            'id':logindeliveryPartner.deliverypartnerid
        }

        const refreshToken = await refreshTokenSign(refreshTokenPayload,'deliveryPartner');
        const accessToken = await accessTokenSign(accessTokenPayload,'deliveryPartner');
                
        if(!refreshToken || !accessToken){
            return res.status(500);
        }

        await redisClient.set(`deliveryPartner:${loginUser.userid}`,refreshToken,{expiration:{type:'EX',value:60*60*20}});

        res.cookie('refreshToken',refreshToken,{httpOnly:true,expires:'20h'});
        return res.status(200).json({
            'role':'user',
            'accessToken':accessToken,
        });

    }catch(err){
        return res.status(500)
    }
})

deliverypartnerRouter.get('/refresh',cookieParser,async(req,res)=>{
    const deliveryPartnerRefreshToken = req.cookies?.['refreshToken'];

    if(!deliveryPartnerRefreshToken){
        return res.status(400);
    }

    const isTokenValid = refreshTokenVerify(deliveryPartnerRefreshToken);

    if(!isTokenValid){
        return res.status(400);
    }

    try{
        const deliveryPartnerRefreshTokenStored = await redisClient.get(`deliveryPartner:${isTokenValid.id}`);
        if(deliveryPartnerRefreshTokenStored==null){
            return res.status(400);
        }
        
        const newAccessToken = await accessTokenSign(deliveryPartnerRefreshToken,'deliveryPartner');

        return res.status(200).json(newAccessToken);
    }catch(err){
        return res.status(400);
    }
})

deliverypartnerRouter.delete('/logout',cookieParser,async(req,res)=>{
    const deliveryPartnerRefreshToken = req.cookies?.['refreshToken'];

    if(!deliveryPartnerRefreshToken){
        return res.status(400);
    }

    const isTokenValid = refreshTokenVerify(deliveryPartnerRefreshToken);

    try{
        res.clearCookie('refreshToken',{httpOnly:true,expires:'1d'});
        await redisClient.del(`deliveryPartner:${isTokenValid.id}`)
        return res.json(200)
    }catch(err){
        return res.status(500)
    }
})


export {deliverypartnerRouter};