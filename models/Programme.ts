import mongoose, { Schema, Document } from 'mongoose';

export interface IProgramme extends Document {
  title: string;
  eligibility: string;
  duration: string;
  image: string;
  text: string;
}

const ProgrammeSchema: Schema = new Schema({
  title: { type: String, required: true },
  eligibility: { type: String, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export default (mongoose.models.Programme as mongoose.Model<IProgramme>) || mongoose.model<IProgramme>('Programme', ProgrammeSchema);
