import { User } from '../models/userModels.js';
import bcrypt from 'bcrypt';
import ErrorHandler from '../helpers/errorHandler.js';

//register user
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ username })) {
      return next(new ErrorHandler('username taken', 401));
    }
    if (await User.findOne({ email })) {
      return next(new ErrorHandler('email already exists', 401));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    user = user.toObject();
    delete user.password;

    return res.status(200).json({
      user,
      status: true,
    });
  } catch (err) {
    err;
  }
};

//user login
const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (!user)
      return next(new ErrorHandler('Incorrect username or password', 401));

    if (!await bcrypt.compare(password, user.password))
      return next(new ErrorHandler('Incorrect username or password', 401));

    user = user.toObject();

    delete user.password;
    delete user.email;

    return res.status(200).json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

//set avatar
const userAvatar = async (req, res, err) => {
  try {
    const userId = req.params.id;

    const avatar = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatar: true,
        avatar,
      },
      { new: true }
    );

    return res.json({
      isSet: userData.isAvatar,
      image: userData.avatar,
    });
  } catch (err) {
    next(err);
  }
};

//get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatar',
      '_id',
    ]);

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export { registerUser, userLogin, userAvatar, getUsers };
