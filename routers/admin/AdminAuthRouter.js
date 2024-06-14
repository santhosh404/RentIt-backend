import express from 'express';
import { signInAdminHandler, signUpAdminHandler } from '../../controllers/admin/auth/AdminAuthController.js';


export const AdminAuthRouter = express.Router();

AdminAuthRouter.post('/auth/signup', signUpAdminHandler);
AdminAuthRouter.post('/auth/signin', signInAdminHandler);
