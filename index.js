import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createConnection } from './config/db.js';
import { userRoutes } from './routes/userRoutes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { msgRoutes } from './routes/msgRoutes.js';
import { Server, Socket } from 'socket.io';
import {createServer} from 'http'

dotenv.config();

//handling uncaught exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shut down due to uncaught exception error`);

  process.exit(1);
});

const PORT = process.env.PORT;

//db connection
createConnection();

const app = express();

const server = createServer(app);

app.use(cors());
app.use(express.json());



const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },});

global.onlineUsers = new Map();

  io.on('connection', (socket) => {

    global.chatSocket = socket;

    socket.on('add-user', (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on('send-msg', (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit('msg-recieve', data.msg);
      }
    });
  
  });

//using routes
app.use('/api/user', userRoutes);
app.use('/api/msgs', msgRoutes);

app.get('/', (req, res) => {
  res.send('Hello from server!!!');
});

app.use(errorMiddleware);

//server
server.listen(PORT, () => {
  console.log(`App is up and running on ${PORT}`);
});


//unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shut down due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
