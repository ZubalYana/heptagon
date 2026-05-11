import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { verifyAdmin } from "../middleware/verifyAdmin";
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }
    if (email != ADMIN_EMAIL || password != ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const adminToken = jwt.sign({ role: "admin" }, JWT_SECRET, {
      expiresIn: "2h",
    });
    res
      .status(200)
      .json({ message: "Admin allowed in", adminToken: adminToken });
  } catch (err) {
    res.status(500).json({ message: "Error loggin in", error: err });
  }
});

router.get("/users", verifyAdmin, async (req,res)=>{
  try{
    const users = await User.find();
    if(!users){
      res.status(404).json({message: 'Users not found'});
    }
    res.status(200).json(users);
  }catch(err){
    res.status(500).json({message: 'Error getting users', err})
  }
})

router.delete("/delete-user", verifyAdmin, async (req, res)=>{
  try{
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    await user.save();
    res.status(200).json({message: 'User deleted successfully'});
  }catch(err){
    res.status(500).json({message: 'Error deleting user.'});
  }
})

export default router;
