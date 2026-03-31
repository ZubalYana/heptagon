import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res)=>{
    try{
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({email});

      if(existingUser){
        return res.status(400).json({message: 'User already exists'});
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword
      })

      await newUser.save();

      const token = jwt.sign(
        {id: newUser._id},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
      )

      res.status(200).json({
        message: 'User registered successfully',
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
      })
    }catch(err){
        console.error('Error registering user:', err);
        res.status(500).json({message: err.message});
    }
})

router.post('/login', async (req, res)=>{
    try{
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        return res.status(400).json({message: "Invalid credentials"});
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    )

    res.status(200).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

export default router;