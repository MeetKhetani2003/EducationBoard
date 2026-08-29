import mongoose, { Schema, Document } from 'mongoose';

export interface IProgramme extends Document {
  title: string;
  eligibility: string;
  duration: string;
  image: string;
  text: string;
  subjects?: Array<{
    name: string;
    max: number;
    min: number;
    hasTh: boolean;
    hasPr: boolean;
    hasIa: boolean;
  }>;
  marksheetColumns?: Array<{
    key: string;
    label: string;
    isCustom: boolean;
  }>;
  materials?: Array<{
    title: string;
    fileUrl: string;
    description?: string;
  }>;
}

const ProgrammeSchema: Schema = new Schema({
  title: { type: String, required: true },
  eligibility: { type: String, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  text: { type: String, required: true },
  subjects: [{
    name: { type: String, required: true },
    max: { type: Number, default: 100 },
    min: { type: Number, default: 33 },
    hasTh: { type: Boolean, default: true },
    hasPr: { type: Boolean, default: false },
    hasIa: { type: Boolean, default: false }
  }],
  marksheetColumns: [{
    key: { type: String, required: true },
    label: { type: String, required: true },
    isCustom: { type: Boolean, default: false }
  }],
  materials: [{
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: String
  }]
}, { timestamps: true });

export default (mongoose.models.Programme as mongoose.Model<IProgramme>) || mongoose.model<IProgramme>('Programme', ProgrammeSchema);

