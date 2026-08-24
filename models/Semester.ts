import mongoose, { Schema, Document } from 'mongoose';

export interface ISemester extends Document {
  name: string;
  course: string;
  academicYear: string;
  isActive: boolean;
}

const SemesterSchema: Schema = new Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  academicYear: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default (mongoose.models.Semester as mongoose.Model<ISemester>) || mongoose.model<ISemester>('Semester', SemesterSchema);
