import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Town from '../models/town';
import verifyJWT from '../middleware/verifyJWT';
import signJWT from '../middleware/signJWT';

const userRouter: express.Router = express.Router();

// validate user is logged in/authenticated
userRouter.get('/validate', express.json(), verifyJWT, (_, res) => res.status(200).json({
  message: 'Token validated',
}));

// user sign up
userRouter.post('/register', express.json(), async (req, res) => {
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
    const token = signJWT(user.username);
    res.status(200).json({
      message: 'Registration successful',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// user login
userRouter.post('/login', express.json(), async (req, res) => {
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
    // const id = user.username;
    // const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    //   algorithm: 'HS256',
    //   expiresIn: '10h', // will be expired after 10 hours
    // });

    const token = signJWT(user.username);
    res.status(200).json({
      message: 'Auth successful',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user's account by username
userRouter.delete('/:username', express.json(), verifyJWT, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    if (user) {
      await Town.deleteMany({
        userId: user._id,
      });
      await User.deleteOne({
        _id: user._id,
      });
    }
    res.status(200).json({
      message: 'User deleted',
      username: req.params.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a user's info by username
userRouter.get('/:username', express.json(), verifyJWT, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    if (!user) {
      res.status(404).json('user not found');
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


// get all the towns created by the user by username
userRouter.get('/:username/towns', express.json(), verifyJWT, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).json('user not found');
      return;
    }
    const towns = await Town.find({ userId: user._id });
    res.status(200).json(towns);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update user's profile information
userRouter.put('/:username', express.json(), verifyJWT, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    if (!user) {
      res.status(404).json('user not found');
      return;
    }
    const validPassword = await bcrypt.compare(req.body.originalPassword, user?.password);
    if (!validPassword) {
      res.status(400).json('wrong password');
      return;
    }
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    await User.updateOne(
      { username: req.params.username },
      {
        $set: req.body,
      });
    res.status(200).json('profile has been updated');
  } catch (err) {
    res.status(500).json(err);
  }
});

export default userRouter;
