import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registerNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  messType: { type: String, enum: ['veg', 'nonveg'], required: true },
  qrToken: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Student = mongoose.model('Student', StudentSchema);
