import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res)=>{
    try{
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword
      })

      await newUser.save();
      res.status(201).json({message: 'User registered successfully'});
    }catch(err){
        console.error('Error registering user:', err);
        res.status(500).json({message: err.message});
    }
})

export default router;