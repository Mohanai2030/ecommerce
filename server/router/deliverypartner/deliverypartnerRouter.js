import express from 'express';
import { deliverypartnerAuthorization } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { deliveryPartnerAuthRouter } from './deliverypartnerauthRouter';

const deliverypartnerRouter = express.Router();

deliverypartnerRouter.use('/auth',deliveryPartnerAuthRouter);

deliverypartnerRouter.use(deliverypartnerAuthorization)

deliverypartnerRouter.put('outForDelivery',async(req,res)=>{
    const {assignedOrderId} = req.params;

    try{
        await prisma.assignedorder.update({
            where:{
                assignedorderid:assignedOrderId,
                deliverypartnerid:req.id,
            },
            data:{
                ordertable:{
                    update:{
                        orderstatus:'outfordelivery'
                    }
                }
            }
        });

        return res.status(200)
    }catch(err){
        return res.status(500)
    }
})

deliverypartnerRouter.put('delivered',async(req,res)=>{
    const {assignedOrderId} = req.params;

    try{
        await prisma.assignedorder.update({
            where:{
                assignedorderid:assignedOrderId,
                deliverypartnerid:req.id,
            },
            data:{
                ordertable:{
                    update:{
                        orderstatus:'delivered'
                    }
                }
            }
        })
        return res.status(200)
    }catch(err){
        return res.status(500)
    }
})

export {deliverypartnerRouter};