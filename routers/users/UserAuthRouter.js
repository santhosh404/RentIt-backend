import express from 'express';
import { forgotPasswordHandler, resetPasswordHandler, signInHandler, signUpHandler } from '../../controllers/users/auth/UserAuthController.js';


export const UserAuthRouter = express.Router();

UserAuthRouter.post('/auth/signup', signUpHandler);
UserAuthRouter.post('/auth/signin', signInHandler);
UserAuthRouter.post('/auth/forgot-password', forgotPasswordHandler);
UserAuthRouter.post('/auth/reset-password/:id/:token', resetPasswordHandler);