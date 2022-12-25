import express from 'express';
import { getUsers, registerUser, userAvatar, userLogin } from '../controllers/userController.js';

const route = express.Router();

route.post('/login', userLogin);
route.post('/register', registerUser);
route.post('/setAvatar/:id', userAvatar);
route.get('/users/:id', getUsers);
route.get('/logout');

export const userRoutes = route;
