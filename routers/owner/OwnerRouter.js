import express from 'express';
import { bookingRequestActionHandler, deleteStoreByIdHandler, getStoreByIdHandler, getStoreByUserIdHandler, postStoreForRentHandler, updateStoreByIdHandler } from '../../controllers/owner/OwnerController.js';
import { authorize } from '../../middlewares/AuthMiddleware.js';


export const OwnerRouter = express.Router();

OwnerRouter.post('/common/post-store', authorize, postStoreForRentHandler);
OwnerRouter.put('/common/booking-request-action', authorize, bookingRequestActionHandler);
OwnerRouter.get('/common/my-store', authorize, getStoreByUserIdHandler);
OwnerRouter.get('/common/my-store/:id', authorize, getStoreByIdHandler);
OwnerRouter.put('/common/my-store/:id', authorize, updateStoreByIdHandler);
OwnerRouter.delete('/common/my-store/:id', authorize, deleteStoreByIdHandler);