import express from 'express';
import { Student } from '../models/Student.js';
import { MealRegistration } from '../models/MealRegistration.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Student only check helper could be added but authenticateToken + student specific logic is enough

router.post('/register', async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });

  const { mealType, date } = req.body; // date format: YYYY-MM-DD
  const studentId = req.user.id;

  try {
    // Enforcement Logic
    const now = new Date();
    const registrationDate = new Date(date);
    const prevDay = new Date(registrationDate);
    prevDay.setDate(prevDay.getDate() - 1);

    // Rule checks
    if (mealType === 'breakfast') {
      // until 9 PM previous day
      const deadline = new Date(prevDay);
      deadline.setHours(21, 0, 0, 0);
      if (now > deadline) return res.status(400).json({ message: 'Deadline passed (9 PM previous day)' });
    } else if (mealType === 'lunch') {
      // until 9 AM same day
      const deadline = new Date(registrationDate);
      deadline.setHours(9, 0, 0, 0);
      if (now > deadline) return res.status(400).json({ message: 'Deadline passed (9 AM today)' });
    } else if (mealType === 'dinner') {
      // until 4 PM same day
      const deadline = new Date(registrationDate);
      deadline.setHours(16, 0, 0, 0);
      if (now > deadline) return res.status(400).json({ message: 'Deadline passed (4 PM today)' });
    }

    // Past meal check
    if (registrationDate < new Date().setHours(0, 0, 0, 0)) {
       return res.status(400).json({ message: 'Cannot register for past meals' });
    }

    const existing = await MealRegistration.findOne({ studentId, date, mealType });
    if (existing) return res.status(400).json({ message: 'Already registered for this meal' });

    const newRegistration = new MealRegistration({ studentId, date, mealType });
    await newRegistration.save();

    res.status(201).json({ message: 'Meal registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-registrations', async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  try {
    const registrations = await MealRegistration.find({ studentId: req.user.id })
      .sort({ date: -1 })
      .limit(90); // Last 30 days roughly 90 meals
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/today', async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  const today = new Date().toISOString().split('T')[0];
  try {
    const registrations = await MealRegistration.find({ studentId: req.user.id, date: today });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
