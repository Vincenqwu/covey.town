import express from 'express';
import verifyJWT from '../middleware/verifyJWT';
import User from '../models/user';
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');


// validate user is logged in/authenticated
router.get('/validate', verifyJWT, (_, res) => {
  return res.status(200).json({
    message: 'Token validated'
  })
});

// user sign up
router.post('/register', async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

// user login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.body.username 
    });
    if (!user) {
      return res.status(404).json("user not found");
    }
    const validPassword = await bcrypt.compare(req.body.password, user?.password);
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    // sign jwt token
    const id = user.username;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: "10h" // will be expired after 10 hours
    })

    res.status(200).json({
      message: 'Auth successful',
      token: token,
      user: user
    })
  } catch (err) {
    res.status(500).json(err)
  }
});

//get a user's info by username
router.get('/:username', verifyJWT, async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username 
    });
    console.log(user);
    if (!user) {
      return res.status(401).json("user not found");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
