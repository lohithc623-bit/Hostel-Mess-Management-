import mongoose from 'mongoose';

const FineSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  reason: { type: String, required: true },
  amount: { type: Number, default: 10 },
}, { timestamps: true });

export const Fine = mongoose.model('Fine', FineSchema);
