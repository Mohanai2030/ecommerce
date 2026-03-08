import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export function refreshTokenSign(payload){
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'},function(err,signedPayload){
            if(err){
                reject(err);
            }

            resolve(signedPayload);
        })
    })
}

export function accessTokenSign(payload){
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'},function(err,signedPayload){
            if(err){
                reject(err);
            }

            resolve(signedPayload);
        })
    })
}

export function accessTokenVerify(accessToken){
    return new Promise((resolve,reject)=>{
        jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,function(err,decodedToken){
            if(err){
                reject(err);
            }

            resolve(decodedToken);
        })
    })
}

export function refreshTokenVerify(refreshToken){
    return new Promise((resolve,reject)=>{
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,function(err,decodedToken){
            if(err){
                reject(err);
            }

            resolve(decodedToken);
        })
    })
}