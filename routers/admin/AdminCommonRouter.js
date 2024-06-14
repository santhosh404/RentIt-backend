import express from 'express';
import { authorize } from '../../middlewares/AuthMiddleware.js';
import { 
    allOwnerRequestHandler, 
    approveOwnerRequestHandler, 
    rejectOwnerRequestHandler 
} from '../../controllers/admin/common/AdminController.js';


export const AdminCommonRouter = express.Router();

AdminCommonRouter.post('/common/approve-owner-request', authorize, approveOwnerRequestHandler);
AdminCommonRouter.post('/common/reject-owner-request', authorize, rejectOwnerRequestHandler);
AdminCommonRouter.get('/common/all-owner-request', authorize, allOwnerRequestHandler);
