import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createConnection } from './config/db.js';
import { userRoutes } from './routes/userRoutes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { msgRoutes } from './routes/msgRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();


const PORT = process.env.PORT;

const users = [];

//db connection
createConnection();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://innercircle.netlify.app'],
};

app.use(cors(corsOptions));
app.use(express.json());

//using routes
app.use('/api/user', userRoutes);
app.use('/api/msgs', msgRoutes);

app.get('/', (req, res) => {
  res.send('Hello from server!!!');
});

app.use(errorMiddleware);

//server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://innercircle.netlify.app'],
    methods: ['GET', 'POST'],
    transports: ['websocket','polling'],
    credentials: true,
  },
  allowEIO3: true,
});

io.on('connection', (socket) => {

  socket.on('add-user', (userId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId: socket.id });
    }

    console.log(users)
  });

  socket.on('send-msgs', (data) => {
    const user = users.find((user) => user.userId === data.to);
    console.log(data)
    if (user) {
      io.to(user.socketId).emit('receive-msg', data.msg);
      console.log('here')
    }
  });

  socket.on('disconnect', () => {
    console.log(`user left`);
  });
});


server.listen(PORT, () => {
  console.log(`App is up and running on ${PORT}`);
});
