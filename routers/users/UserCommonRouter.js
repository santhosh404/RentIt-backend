import express from 'express';
import { allRentalStoresHandler, getRentRequestOfUserHandler, getUserMailId, makeOwnerRequestHandler, makePaymentHandler, makeRentRequestHandler, ownerRequestById, paymentVerificationHandler, updateProfile } from '../../controllers/users/common/UserCommonController.js';
import { authorize } from '../../middlewares/AuthMiddleware.js';

export const UserCommonRouter = express.Router();

UserCommonRouter.post('/common/owner-request', authorize, makeOwnerRequestHandler);
UserCommonRouter.get('/common/owner-request', authorize, ownerRequestById);
UserCommonRouter.get('/common/user', authorize, getUserMailId);
UserCommonRouter.put('/common/user', authorize, updateProfile);
UserCommonRouter.post('/common/rent-request', authorize, makeRentRequestHandler);
UserCommonRouter.get('/common/rent-request', authorize, getRentRequestOfUserHandler);
UserCommonRouter.get('/common/all-rental-stores', authorize, allRentalStoresHandler);
UserCommonRouter.post('/common/payment', authorize, makePaymentHandler);
UserCommonRouter.post('/common/payment-verification', authorize, paymentVerificationHandler); 