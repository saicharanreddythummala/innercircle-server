import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatar: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
});

export let User = mongoose.model('users', userModel);
