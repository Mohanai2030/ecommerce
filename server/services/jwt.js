import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export function refreshTokenSign(payload,userRole){
    return new Promise((resolve,reject)=>{
        switch(userRole){
            case 'user':{
                jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'},function(err,signedPayload){
                    if(err){
                        reject(err);
                    }

                    resolve(signedPayload);
                })
                break;
            }
            case 'admin':{
                jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'12h'},function(err,signedPayload){
                    if(err){
                        reject(err);
                    }

                    resolve(signedPayload);
                })
                break;
            }
            case 'deliveryPartner':{
                jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'20h'},function(err,signedPayload){
                    if(err){
                        reject(err);
                    }

                    resolve(signedPayload);
                })
                break;
            }
        }
    })
}

export function accessTokenSign(payload,userRole){
    return new Promise((resolve,reject)=>{
        switch(userRole){
            case 'user':{
                jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'},function(err,signedPayload){
                    if(err){
                        reject(err);
                    }

                    resolve(signedPayload);
                })
                break;
            }
            case 'admin':{
                jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:60*10},function(err,signedPayload){
                    if(err){
                        reject(err);
                    }

                    resolve(signedPayload);
                })
                break;
            }
            case 'deliveryPartner':{
                jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:60*30},function(err,signedPayload){
                    if(err){
                        reject(err);
                    }

                    resolve(signedPayload);
                })
                break;
            }
        }
        
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