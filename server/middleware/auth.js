import { accessTokenVerify } from '../services/jwt';
import { roles } from '../constants/roles';

async function Authorizer(req,role){

    const authorizationHeader = req.headers?.['authorization'];

    if(!authorizationHeader){
        return {
            'success':false,
            'error':'',
            'data':null,
        }
    }

    const accessToken = authorizationHeader.split(' ')?.[1];
    if(!accessToken){
        return {
            'success':false,
            'error':'',
            'data':null,
        }
    }

    const isTokenValid = await accessTokenVerify(accessToken);
    if(!isTokenValid){
        return {
            'success':false,
            'error':'',
            'data':null,
        }
    } 

    if(isTokenValid['role']==roles[role]){
        return {
            'success':true,
            'error':null,
            'data':isTokenValid
        }
    }else{
        return {
            'success':false,
            'error':"Not authorized",
            'data':null
        }
    }
    
}

async function userAuthorization(req,res,next) {
    const authorized = await Authorizer(req,'user');
    
    if(authorized.success==false){
        return res.status(400).json(authorized.error);
    }else{
        req.id = authorized.data.id;
        req.role = 'user';
        next();
    }
}


async function adminAuthorization(req,res,next) {
    const authorized = await Authorizer(req,'admin');
    
    if(authorized.success==false){
        return res.status(400).json(authorized.error);
    }else{
        req.id = authorized.data.id;
        req.role = 'admin';
        next();
    }
}

async function deliverypartnerAuthorization(req,res,next) {
    const authorized = await Authorizer(req,'admin');
    
    if(authorized.success==false){
        return res.status(400).json(authorized.error);
    }else{
        req.id = authorized.data.id;
        req.role = 'admin';
        next();
    }
}

export {userAuthorization,adminAuthorization,deliverypartnerAuthorization};