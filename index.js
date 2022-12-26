import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createConnection } from './config/db.js';
import { userRoutes } from './routes/userRoutes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { msgRoutes } from './routes/msgRoutes.js';
import { Server } from 'socket.io';

dotenv.config();

//handling uncaught exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shut down due to uncaught exception error`);

  process.exit(1);
});

const PORT = process.env.PORT;

const users = [];

//db connection
createConnection();

const app = express();

// const server = createServer(app);

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
const server = app.listen(PORT, () => {
  console.log(`App is up and running on ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('add-user', (userId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId: socket.id });
    }
  });

  socket.on('send-msgs', (data) => {
    const user = users.find((user) => user.userId === data.to);

    if (user) {
      socket.to(user.socketId).emit('receive-msg', data.msg)
    }
  });
});

//unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shut down due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
