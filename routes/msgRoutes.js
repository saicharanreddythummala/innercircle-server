import express from 'express';
import { getMessages, sendMessage } from '../controllers/msgController.js';

const route = express.Router();

route.post('/send', sendMessage);
route.post('/receive', getMessages); 


export const msgRoutes = route;
