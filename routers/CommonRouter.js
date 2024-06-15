import express from 'express';
import { authorize } from '../middlewares/AuthMiddleware.js';
import { getDistricts, getStates, uploadFile } from '../controllers/CommonController.js';
import multer from 'multer';


export const CommonRouter = express.Router();
const upload = multer()

CommonRouter.get('/states', authorize, getStates);
CommonRouter.get('/districts', authorize,  getDistricts);
CommonRouter.post('/upload-file', authorize, upload.single('file'), uploadFile);