import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check User (Admin/Superadmin)
    let user = await User.findOne({ email });
    let role = '';
    let foundUser = null;

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        role = user.role;
        foundUser = user;
      }
    }

    // Check Student if not found in User
    if (!foundUser) {
      let student = await Student.findOne({ email, isActive: true });
      if (student) {
        const isMatch = await bcrypt.compare(password, student.password);
        if (isMatch) {
          role = 'student';
          foundUser = student;
        }
      }
    }

    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: foundUser._id, role, email: foundUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
