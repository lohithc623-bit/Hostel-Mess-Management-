import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './backend/models/User.js';

dotenv.config();

const seedSuperadmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-mess');
    console.log('Connected to MongoDB for seeding');

    const email = process.env.SUPERADMIN_EMAIL || 'balajidamineni@gmail.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'admin2026';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Superadmin already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const superadmin = new User({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'superadmin'
      });
      await superadmin.save();
      console.log('Superadmin created successfully');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedSuperadmin();
