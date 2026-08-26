import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  enrollmentNumber: string;
  name: string;
  fatherName: string;
  dob: Date;
  email?: string;
  phone?: string;
  address?: string;
  programmes?: string[];
  passwordHash: string;
}

const StudentSchema: Schema = new Schema({
  enrollmentNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  programmes: { type: [String], default: [] },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export default (mongoose.models.Student as mongoose.Model<IStudent>) || mongoose.model<IStudent>('Student', StudentSchema);
