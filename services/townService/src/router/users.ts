import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import verifyJWT from '../middleware/verifyJWT';

const userRouter:Router = Router();

// validate user is logged in/authenticated
userRouter.get('/validate', verifyJWT, (_, res) => res.status(200).json({
  message: 'Token validated',
}));

// user sign up
userRouter.post('/register', async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// user login
userRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.body.username, 
    });
    if (!user) {
      res.status(404).json('user not found');
      return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user?.password);
    if (!validPassword) {
      res.status(400).json('wrong password');
      return;
    }

    // sign jwt token
    const id = user.username;
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
      algorithm: 'HS256',
      expiresIn: '10h', // will be expired after 10 hours
    });

    res.status(200).json({
      message: 'Auth successful',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a user's info by username
userRouter.get('/:username', verifyJWT, async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username, 
    });
    console.log(user);
    if (!user) {
      res.status(401).json('user not found');
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default userRouter;
