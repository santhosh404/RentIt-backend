import express from 'express';
import { allRentalStoresHandler, getUserMailId, makeOwnerRequestHandler, makeRentRequestHandler, ownerRequestById, updateProfile } from '../../controllers/users/common/UserCommonController.js';
import { authorize } from '../../middlewares/AuthMiddleware.js';

export const UserCommonRouter = express.Router();

UserCommonRouter.post('/common/owner-request', authorize, makeOwnerRequestHandler);
UserCommonRouter.get('/common/owner-request', authorize, ownerRequestById);
UserCommonRouter.get('/common/user', authorize, getUserMailId);
UserCommonRouter.put('/common/user', authorize, updateProfile);
UserCommonRouter.post('/common/rent-request', authorize, makeRentRequestHandler);
UserCommonRouter.get('/common/all-rental-stores', authorize, allRentalStoresHandler);