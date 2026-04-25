import express from 'express';
import { Student } from '../models/Student.js';
import { MealRegistration } from '../models/MealRegistration.js';
import { authenticateToken } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/verify', authenticateToken, roleCheck(['admin', 'superadmin']), async (req, res) => {
  const { qrToken, mealType, date } = req.body;

  try {
    const student = await Student.findOne({ qrToken, isActive: true });
    if (!student) return res.status(404).json({ message: 'Student not found or inactive' });

    const registration = await MealRegistration.findOne({
      studentId: student._id,
      date,
      mealType
    });

    if (!registration) {
      return res.status(400).json({ message: 'Student did not register for this meal' });
    }

    if (registration.status === 'attended') {
      return res.status(400).json({ message: 'Already scanned' });
    }

    if (registration.status === 'fined') {
      return res.status(400).json({ message: 'Student was already fined for this meal' });
    }

    registration.status = 'attended';
    registration.scannedAt = new Date();
    registration.scannedBy = req.user.id;
    await registration.save();

    res.json({
      message: 'Verified ✓',
      student: {
        name: student.name,
        registerNumber: student.registerNumber,
        messType: student.messType
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
