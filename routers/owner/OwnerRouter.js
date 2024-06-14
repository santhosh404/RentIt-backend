import express from 'express';
import { authorize } from '../../middlewares/AuthMiddleware.js';
import { makeOwnerRequestHandler } from '../../controllers/owner/OwnerController.js';


export const OwnerRouter = express.Router();


OwnerRouter.post('/owner-request', authorize, makeOwnerRequestHandler);