import mongoose from 'mongoose';

export const createConnection = () => {
  mongoose.set('strictQuery', false);

  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected to db');
    })
    .catch((err) => {
      console.error(err.message);
    });
};
