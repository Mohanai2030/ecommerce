import express from 'express';
import { prisma } from '../../lib/prisma.js';
import { roles } from '../../constants/roles.js';
import { accessTokenSign, refreshTokenSign } from '../../services/jwt.js';
import cookieParser from 'cookie-parser';
import { deliveryPartnerAuthRouter } from './deliverypartnerauthRouter.js';
const deliverypartnerRouter = express.Router();


deliverypartnerRouter.use(deliveryPartnerAuthRouter);


export {deliverypartnerRouter};