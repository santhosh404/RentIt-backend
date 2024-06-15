import express from 'express';
import { authorize } from '../../middlewares/AuthMiddleware.js';
import { 
    allOwnerRequestHandler, 
    approveOwnerRequestHandler, 
    ownerByIdHandler, 
    ownerRequestFilterHandler, 
    rejectOwnerRequestHandler 
} from '../../controllers/admin/common/AdminController.js';
import { isAdmin } from '../../middlewares/AdminMiddleware.js';


export const AdminCommonRouter = express.Router();

AdminCommonRouter.post('/common/approve-owner-request', authorize, isAdmin, approveOwnerRequestHandler);
AdminCommonRouter.post('/common/reject-owner-request', authorize, isAdmin, rejectOwnerRequestHandler);
AdminCommonRouter.get('/common/all-owner-request', authorize, isAdmin, allOwnerRequestHandler);
AdminCommonRouter.get('/common/owner-request', authorize, isAdmin, ownerRequestFilterHandler);
AdminCommonRouter.get('/common/owner-request/:id', authorize, isAdmin, ownerByIdHandler);