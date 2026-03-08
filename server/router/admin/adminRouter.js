import express from 'express';
import { adminQueryBuilder, updateProductQueryBuilder } from '../services/productquery';
import { prisma } from '../../lib/prisma';
import { adminAuthorization } from '../../middleware/auth';
import { adminAuthRouter } from './adminauthRouter';
const adminRouter = express.Router();

adminRouter.use('/auth',adminAuthRouter);

adminRouter.use(adminAuthorization);

adminRouter.get('/products',async(req,res)=>{
    // pageNo and pageSize must be greather than 0 
    const queryObject = adminQueryBuilder(req.query);
    try{
        let nextProducts = await prisma.product.findMany(queryObject)
        return res.status(200).json(nextProducts);
    }catch(err){
        return res.status(500);
    }
})

adminRouter.post('/product',async(req,res)=>{
    const {productName,quantity,description,price} = req.body;

    try{
        const createdProduct = await prisma.product.create({
            data:{
                productname:productName,
                produtctdescription:description,
                price:price,
                quantity:quantity
            }
        })

        return res.status(200).json({
            'data':createdProduct.productid
        })
    }catch(err){
        return res.status(500)
    }
})

adminRouter.put('/product',async(req,res)=>{
    const updateQueryObject = updateProductQueryBuilder(req.body);
    try{
        const updatedProduct = await prisma.product.update(updateQueryObject);
        return res.status(200)
    }catch(err){
        return res.status(500)
    }
})

export {adminRouter};