import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  semesterId: mongoose.Types.ObjectId;
  fullMarks: number;
  passMarks: number;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true },
  fullMarks: { type: Number, required: true },
  passMarks: { type: Number, required: true }
}, { timestamps: true });

export default (mongoose.models.Subject as mongoose.Model<ISubject>) || mongoose.model<ISubject>('Subject', SubjectSchema);
