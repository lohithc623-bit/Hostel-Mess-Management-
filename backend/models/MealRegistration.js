import mongoose from 'mongoose';

const MealRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['registered', 'attended', 'fined'], default: 'registered' },
  scannedAt: { type: Date },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Ensure uniqueness per student, date, and mealType
MealRegistrationSchema.index({ studentId: 1, date: 1, mealType: 1 }, { unique: true });

export const MealRegistration = mongoose.model('MealRegistration', MealRegistrationSchema);
