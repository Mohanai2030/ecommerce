import express from 'express';
import {prisma} from '../../lib/prisma.js';
import { addItem, calculateDeliveryFee, calculateTotalPrice, categorizeUpdates, deleteItem, newCartFromSuccessfullUpdates, updateItem } from '../../services/cart.js';
import { userAuthorization } from '../../middleware/auth.js';
import { userAuthRouter } from './userauthRouter.js';

const userRouter = express.Router();

userRouter.use('/auth',userAuthRouter);


userRouter.get('/products',async(req,res)=>{
    const pageNo = req.query.pageNo;
    const pageSize = req.query.pageSize;
    const pattern = req.query?.pattern || '';  
    // pageNo and pageSize must be greather than 0 
    try{
        let nextProducts;
        if(pattern==''){
            nextProducts = await prisma.product.findMany({
                orderBy:{
                    productid:'asc',
                },
                include:{
                    productimage:true
                },
                skip:pageNo*(pageSize-1),
                take:pageSize,
            })
        }else{
            nextProducts = await prisma.product.findMany({
                where:{
                    productname:{
                        startsWith:pattern,
                    }
                },
                orderBy:{
                    productid:'asc',
                    productname:'asc'
                },
                include:{
                    productimage:true
                },
                skip:pageNo*(pageSize-1),
                take:pageSize,
            })
        }

        return res.status(200).json(nextProducts);
    }catch(err){
        return res.status(500);
    }
})

userRouter.post('/order',userAuthorization,async(req,res)=>{
    const {cartId} = req.body;

    try{

        const orderCart = await prisma.cart.findFirst({
            include:{
                cartproduct:true,
            },
            where:{
                cartid:cartId,
                userid:req.id,
            }
        })

        const orderPlacedItemsandconfirmedOrder = await prisma.$transaction([
            ...Object.keys(orderCart.cartproduct).map(product=>
                prisma.product.update({
                    where:{
                        productid:product.productid,
                        quantity:{
                            gte:product.quantity
                        }
                    },
                    
                })
            ),
            prisma.ordertable.create({
                data:{
                    userid:req.id,
                    deliveryfee:orderCart.deliveryfee,
                    totalamount:orderCart.totalprice,
                    orderstatus:'placed',
                    orderproducts:{
                        create:[...orderCart.cartproduct.map(product => {
                            return{
                                productid:product.productid,
                                quantity:product.quantity
                            }
                        })]
                    }
                }
            })
        ]);
        
        
        const confirmedOrder = orderPlacedItemsandconfirmedOrder.at[-1];

        return res.status(200).json({
            'data':confirmedOrder.orderId
        })

        
    }catch(err){
        return res.status(500)
    }

})

userRouter.get('/orders',userAuthorization,async(req,res)=>{
    let orderStatus = req.params?.orderStatus || 'pending';

    try{
        let orders;
        if(orderStatus=='pending'){
            orders = await prisma.ordertable.findMany({
                where:{
                    userid:req.id,
                    NOT:{
                        orderstatus:'delivered'
                    },
                }
            })
        }else{
            orders = await prisma.ordertable.findMany({
                where:{
                    userid:req.id,
                    orderstatus:orderStatus
                }
            })
        }

        return res.status(200).json({
            'data':orders
        })
    }catch(err){
        return res.status(500);
    }

})

// user will modify the quantity and we will wait for 5 seconds or a few seconds and api call will be made then the modifyCart functionality will be disabled until the api call is running 

userRouter.put('/cart',userAuthorization,async(req,res)=>{
    const {cartId,oldCart,cartUpdate,cartAdd,cartDelete} = req.body;
    
    // check for negative values 
    try{
        const cartAdds = Object.keys(cartAdd).map(toAddItem => addItem(cartId,toAddItem,cartAdd[toAddItem]));
        const cartUpdates = Object.keys(cartUpdate).map(toUpdateItem => updateItem(cartId,toUpdateItem,cartUpdate[toUpdateItem]))
        const cartDeletes = Object.keys(cartDelete).map(toDeleteItem => deleteItem(cartId,toDeleteItem))
        const allModifications = [...cartAdds,...cartUpdates,...cartDeletes];
        
        let allUpdates = await Promise.allSettled(allModifications);
    
        let [successfullUpdates,failureUpdates] = categorizeUpdates(allUpdates);
        let currentCart = newCartFromSuccessfullUpdates(oldCart,successfullUpdates);

        if(failureUpdates.length>0){
            return res.status(200).json({
                data:{
                    'cart':currentCart,
                },
                error:failureUpdates.map(fupdate => fupdate.error)
            });
        }

        let totalPrice = calculateTotalPrice(successfullUpdates);
        let deliveryFee = calculateDeliveryFee(currentCart,totalPrice);

        let updatedCart = await prisma.cart.update({
            where:{
                cartid:cartId
            },
            data:{
                deliveryfee:deliveryFee,
                totalprice:totalPrice
            }
        })

        return res.status(200).json({
            data:{
                'cart':currentCart,
                'totalPrice':totalPrice,
                'deliveryFee':deliveryFee,
            },
            error:null
        });
        
        
    }catch(err){
        return res.status(500);
    }
    
})


export {userRouter};