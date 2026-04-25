import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { MealRegistration } from '../models/MealRegistration.js';
import { Fine } from '../models/Fine.js';
import { authenticateToken } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(authenticateToken);

// SUPERADMIN ONLY: Register Staff
router.post('/register-staff', roleCheck(['superadmin']), async (req, res) => {
  const { name, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash('hostel2026', 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      createdBy: req.user.id
    });
    await newUser.save();
    res.status(201).json({ message: 'Staff registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/staff', roleCheck(['superadmin']), async (req, res) => {
  try {
    const staff = await User.find({ role: 'admin' }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/staff/:id', roleCheck(['superadmin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN/SUPERADMIN: Student Management
router.post('/register-student', roleCheck(['admin', 'superadmin']), async (req, res) => {
  const { name, registerNumber, email, messType } = req.body;
  try {
    const existingStudent = await Student.findOne({ $or: [{ email }, { registerNumber }] });
    if (existingStudent) return res.status(400).json({ message: 'Student already exists' });

    const hashedPassword = await bcrypt.hash('hostel2026', 10);
    const qrToken = uuidv4();
    const newStudent = new Student({
      name,
      registerNumber,
      email,
      password: hashedPassword,
      messType,
      qrToken,
      registeredBy: req.user.id
    });
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully', qrToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/students', roleCheck(['admin', 'superadmin']), async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/students/:id', roleCheck(['admin', 'superadmin']), async (req, res) => {
  const { name, messType, email, registerNumber } = req.body;
  try {
    await Student.findByIdAndUpdate(req.params.id, { name, messType, email, registerNumber });
    res.json({ message: 'Student updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/students/:id', roleCheck(['admin', 'superadmin']), async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Student deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/meal-log', roleCheck(['admin', 'superadmin']), async (req, res) => {
  const { date, mealType } = req.query;
  try {
    let query = {};
    if (date) query.date = date;
    if (mealType) query.mealType = mealType;
    const logs = await MealRegistration.find(query).populate('studentId', 'name registerNumber messType');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/fines', roleCheck(['admin', 'superadmin']), async (req, res) => {
  try {
    const fines = await Fine.find().populate('studentId', 'name registerNumber');
    res.json(fines);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
