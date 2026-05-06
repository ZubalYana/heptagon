import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post("/login", (req, res) => {
  try {
    const { enteredEmail, enteredPassword } = req.body;
    if (!enteredEmail || !enteredPassword) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }
    if (enteredEmail != ADMIN_EMAIL || enteredPassword != ADMIN_PASSWORD) {
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

export default router;
