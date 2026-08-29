import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  title: string;
  programme: string;
  examYear: string;
  registrationStartDate: Date;
  examStartDate: Date;
  resultDate: Date;
  status: 'Upcoming' | 'Result Declared' | 'Completed' | 'Ongoing';
  duration?: number; // duration in minutes
  joiningWindow?: number; // joining window in minutes (e.g. 5)
  examState?: 'inactive' | 'portal_open' | 'running' | 'ended';
  portalOpenTime?: Date;
  startTime?: Date;
  paper?: {
    mcqs: Array<{
      question: string;
      options: string[];
      correctOption: number; // index 0-3
      marks: number;
    }>;
    theory: Array<{
      question: string;
      marks: number;
    }>;
  };
}

const ExamSchema: Schema = new Schema({
  title: { type: String, required: true },
  programme: { type: String, required: true },
  examYear: { type: String, required: true },
  registrationStartDate: { type: Date, required: true },
  examStartDate: { type: Date, required: true },
  resultDate: { type: Date, required: true },
  status: { type: String, enum: ['Upcoming', 'Result Declared', 'Completed', 'Ongoing'], default: 'Upcoming' },
  duration: { type: Number, default: 120 },
  joiningWindow: { type: Number, default: 5 },
  examState: { type: String, enum: ['inactive', 'portal_open', 'running', 'ended'], default: 'inactive' },
  portalOpenTime: Date,
  startTime: Date,
  paper: {
    mcqs: [{
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctOption: { type: Number, required: true },
      marks: { type: Number, required: true }
    }],
    theory: [{
      question: { type: String, required: true },
      marks: { type: Number, required: true }
    }]
  }
}, { timestamps: true });

export default (mongoose.models.Exam as mongoose.Model<IExam>) || mongoose.model<IExam>('Exam', ExamSchema);

