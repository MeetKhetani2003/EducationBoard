import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  title: string;
  programme: string;
  examYear: string;
  registrationStartDate: Date;
  examStartDate: Date;
  resultDate: Date;
  status: 'Upcoming' | 'Result Declared' | 'Completed' | 'Ongoing';
}

const ExamSchema: Schema = new Schema({
  title: { type: String, required: true },
  programme: { type: String, required: true },
  examYear: { type: String, required: true },
  registrationStartDate: { type: Date, required: true },
  examStartDate: { type: Date, required: true },
  resultDate: { type: Date, required: true },
  status: { type: String, enum: ['Upcoming', 'Result Declared', 'Completed', 'Ongoing'], default: 'Upcoming' }
}, { timestamps: true });

export default (mongoose.models.Exam as mongoose.Model<IExam>) || mongoose.model<IExam>('Exam', ExamSchema);
