import express from 'express';
import { 
    allRentalStoresHandler, 
    getMyBookingLogs, 
    getRentRequestOfUserHandler, 
    getUserMailId, 
    makeOwnerRequestHandler, 
    makePaymentHandler, 
    makeRentRequestHandler, 
    ownerRequestById, 
    paymentVerificationHandler, 
    updatePaymentOnSuccessHandler, 
    updateProfile 
} from '../../controllers/users/common/UserCommonController.js';
import { authorize } from '../../middlewares/AuthMiddleware.js';

export const UserCommonRouter = express.Router();

UserCommonRouter.post('/common/owner-request', authorize, makeOwnerRequestHandler);
UserCommonRouter.get('/common/owner-request', authorize, ownerRequestById);
UserCommonRouter.get('/common/user', authorize, getUserMailId);
UserCommonRouter.put('/common/user', authorize, updateProfile);
UserCommonRouter.post('/common/rent-request', authorize, makeRentRequestHandler);
UserCommonRouter.get('/common/rent-request', authorize, getRentRequestOfUserHandler);
UserCommonRouter.get('/common/all-rental-stores', allRentalStoresHandler);
UserCommonRouter.post('/common/payment', authorize, makePaymentHandler);
UserCommonRouter.post('/common/payment-verification', authorize, paymentVerificationHandler); 
UserCommonRouter.put('/common/update-payment', authorize, updatePaymentOnSuccessHandler);
UserCommonRouter.get('/common/booking-logs', authorize, getMyBookingLogs);
