import express from 'express';
import bcrypt from 'bcryptjs';
import { Student } from '../models/Student.js';
import { Fine } from '../models/Fine.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  try {
    const student = await Student.findById(req.user.id).select('-password');
    const fines = await Fine.find({ studentId: req.user.id });
    res.json({ student, fines });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const student = await Student.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid old password' });

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
