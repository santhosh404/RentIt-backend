import express from 'express';
import { ownerRequestById } from '../../controllers/users/common/UserCommonController.js';
import { authorize } from '../../middlewares/AuthMiddleware.js';

export const UserCommonRouter = express.Router();

// UserCommonRouter.get('/common/user-details', UserDetails)
UserCommonRouter.get('/common/owner-request', authorize, ownerRequestById);
