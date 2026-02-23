// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: string;
    fontSize: string;
    autoSave: boolean;
    offlineMode: boolean;
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
      mentions: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  name: { type: String, required: true, trim: true },
  avatar: String,
  preferences: {
    theme: { type: String, default: 'system' },
    fontSize: { type: String, default: 'medium' },
    autoSave: { type: Boolean, default: true },
    offlineMode: { type: Boolean, default: true },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
