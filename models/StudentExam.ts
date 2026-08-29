import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentExam extends Document {
  studentEnrollment: string;
  examId: string;
  joinedAt?: Date;
  leftExam: boolean; // lock out state
  answers: {
    mcqs: Record<string, number>; // index of MCQ answer
    theory: Record<string, string>; // subjective answers
  };
  mcqMarks: number;
  theoryMarks: Record<string, number>; // theory grades given by admin
  isChecked: boolean; // result checked status
  isSubmitted: boolean;
  submittedAt?: Date;
}

const StudentExamSchema: Schema = new Schema({
  studentEnrollment: { type: String, required: true },
  examId: { type: String, required: true },
  joinedAt: Date,
  leftExam: { type: Boolean, default: false },
  answers: {
    mcqs: { type: Map, of: Number, default: {} },
    theory: { type: Map, of: String, default: {} }
  },
  mcqMarks: { type: Number, default: 0 },
  theoryMarks: { type: Map, of: Number, default: {} },
  isChecked: { type: Boolean, default: false },
  isSubmitted: { type: Boolean, default: false },
  submittedAt: Date
}, { timestamps: true });

// Ensure unique student entry per exam session
StudentExamSchema.index({ studentEnrollment: 1, examId: 1 }, { unique: true });

export default (mongoose.models.StudentExam as mongoose.Model<IStudentExam>) || mongoose.model<IStudentExam>('StudentExam', StudentExamSchema);
