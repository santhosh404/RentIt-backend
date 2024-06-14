
//Importing required modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './database/config.js';
import { UserAuthRouter } from './routers/auth/UserAuthRouter.js';
import { OwnerRouter } from './routers/owner/OwnerRouter.js';
import { AdminCommonRouter } from './routers/admin/AdminCommonRouter.js';
import { AdminAuthRouter } from './routers/admin/AdminAuthRouter.js';
import { UserCommonRouter } from './routers/auth/UserCommonRouter.js';

//Configuring dotenv
dotenv.config();

//Initializing the express server
const app = express();

//Adding middlewares
app.use(express.json());
app.use(cors());

//Connecting to database
connectDatabase();

//Adding routes 
app.use('/api/v1/user', [UserAuthRouter, UserCommonRouter]);
app.use('/api/v1/admin', [AdminAuthRouter, AdminCommonRouter]);
app.use('/api/v1/owner', OwnerRouter);

//Starting the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});