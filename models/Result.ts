import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  enrollmentNumber: string;
  rollNumber: string;
  studentName: string;
  fatherName: string;
  dob: Date;
  programme: string;
  examination: string;
  examYear: string;
  resultDate: Date;
  subjects: Array<{
    sNo: string;
    name: string;
    max: number;
    min: number;
    th: number;
    pr: number;
    total: number;
    grade: string;
  }>;
  grandTotal: number;
  percentage: number;
  resultStatus: string;
}

const ResultSchema: Schema = new Schema({
  enrollmentNumber: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true },
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  programme: { type: String, required: true },
  examination: { type: String, required: true },
  examYear: { type: String, required: true },
  resultDate: { type: Date, default: Date.now },
  subjects: [{
    sNo: String,
    name: String,
    max: Number,
    min: Number,
    th: Number,
    pr: Number,
    total: Number,
    grade: String
  }],
  grandTotal: { type: Number, required: true },
  percentage: { type: Number, required: true },
  resultStatus: { type: String, required: true }
}, { timestamps: true });

// Avoid model recompilation errors in Next.js
export default (mongoose.models.Result as mongoose.Model<IResult>) || mongoose.model<IResult>('Result', ResultSchema);
