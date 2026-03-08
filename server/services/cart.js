import {prisma} from '../lib/prisma.js'
import { NotEnoughStockError } from '../errors/stock.js';
import { deliveryFeeThreshold } from '../constants/deliveryFee.js';

async function addItem(cartId,productId,quantity){
    try{
        const validAdd = await prisma.$transaction(async(tx)=>{
            const currentStock  = await tx.product.findFirst({
                select:{
                    quantity:true,
                    price:true
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
                    quantity:quantity
                }
            })
        })

        return {
            'success':true,
            'data':{
                'type':'add',
                'productId':productId,
                'quantity':quantity,
                'totalPrice':quantity*currentStock.price
            },
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
            'data':{
                'type':'update',
                'productId':productId,
                'quantity':newQuantity,
                'totalPrice':newQuantity*currentStock.price
            },
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
            'data':{
                'type':'delete',
                'productId':productId
            },
            'error':null,
        }

    }catch(err){

        return {
            'success':false,
            'error':err,
        };

    }
}

async function categorizeUpdates(updates){
    let successfullUpdates = [];
    let failureUpdates = [];
    updates.forEach(update => {
        if(update.value['success']){
            successfullUpdates.push(update.value);
        }else{
            failureUpdates.push(update.value);
        }
    })
    return [successfullUpdates,failureUpdates];
}

function newCartFromSuccessfullUpdates(oldCart,successfullUpdates){
    successfullUpdates.forEach(update => {
        switch(update['data']['type']){
            case 'add':{
                oldCart[update['data']['productId']] = update['data']['quantity'];
                break;
            }
            case 'update':{
                oldCart[update['data']['productId']] = update['data']['quantity'];
                break;
            }
            case 'delete':{
                delete oldCart[update['data']['productId']]
                break;
            }
        }
    });
    return oldCart;
}

function calculateTotalPrice(successfullUpdates){
    let totalCartPrice = successfullUpdates.reduce((sumTillNow,update) => sumTillNow+update['data']['totalPrice'],0)
}

function calculateDeliveryFee(cart,totalPrice){
    if(totalPrice<deliveryFeeThreshold){
        return 50;
    }else{
        return 0;
    }
}

export {addItem,updateItem,deleteItem,categorizeUpdates,newCartFromSuccessfullUpdates,calculateTotalPrice,calculateDeliveryFee}