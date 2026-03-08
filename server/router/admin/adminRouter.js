import express from 'express';
import { prisma } from '../../lib/prisma.js';
import { roles } from '../../constants/roles.js';
import { accessTokenSign, refreshTokenSign } from '../../services/jwt.js';
import cookieParser from 'cookie-parser';
import { adminAuthRouter } from './adminauthRouter.js';
const adminRouter = express.Router();

adminRouter.use(adminAuthRouter);

export {adminRouter};