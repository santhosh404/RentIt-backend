import express from 'express';
import { getUserMailId, makeOwnerRequestHandler, ownerRequestById } from '../../controllers/users/common/UserCommonController.js';
import { authorize } from '../../middlewares/AuthMiddleware.js';

export const UserCommonRouter = express.Router();

UserCommonRouter.post('/common/owner-request', authorize, makeOwnerRequestHandler);
UserCommonRouter.get('/common/owner-request', authorize, ownerRequestById);
UserCommonRouter.get('/common/user', authorize, getUserMailId);
