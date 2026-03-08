import express from 'express';
import {prisma} from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import {roles} from '../constants/roles.js'
import { accessTokenSign, refreshTokenSign, refreshTokenVerify } from '../services/jwt.js';
import { redisClient } from '../config/redis.js';
import cookieParser from 'cookie-parser';
import { userAuthRouter } from './user/userauthRouter.js';

const userRouter = express.Router();

userRouter.use('/auth',userAuthRouter);


export {userRouter};