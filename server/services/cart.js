import {prisma} from '../lib/prisma.js'
import { NotEnoughStockError } from '../errors/stock.js';

async function addItem(cartId,productId,quantity){
    try{
        const validAdd = await prisma.$transaction(async(tx)=>{
            const currentStock  = await tx.product.findFirst({
                select:{
                    quantity:true,
                },
                where:{
                    productId:productId
                }
                
            });

            if(currentStock<quantity){
                throw new NotEnoughStockError(`This item only has ${currentStock} items left`);
            }

            return await tx.cartproduct.create({
                data:{
                    cartid:cartId,
                    productid:productId,
                    quantity:quantity,
                }
            })
        })

        return {
            'success':true,
            'error':null,
        };
    }catch(err){
       
        return {
            'success':false,
            'error':err,
        };
        
    }
}

async function updateItem(cartId,productId,newQuantity){
    try{
        const validUpdate = await prisma.$transaction(async(tx)=>{
            const currentStock  = await tx.product.findFirst({
                select:{
                    quantity:true,
                },
                where:{
                    productId:productId
                }
                
            });

            if(currentStock<newQuantity){
                throw new NotEnoughStockError(`This item only has ${currentStock} items left`);
            }

            return await tx.cartproduct.update({
                where:{
                    cartid:cartId,
                    productid:productId
                },
                data:{
                    quantity:newQuantity,
                }
            });
        })

        return {
            'success':true,
            'error':null,
        }
    }catch(err){
        return {
            'success':false,
            'error':err,
        };
    }
}

async function deleteItem(cartId,productId){
    try{
        const removeItem = await prisma.cartproduct.delete({
            where:{
                cartid:cartId,
                productid:productId,
            }
        }) 

        return {
            'success':true,
            'error':null,
        }

    }catch(err){

        return {
            'success':false,
            'error':err,
        };

    }
}

export {addItem,updateItem,deleteItem}