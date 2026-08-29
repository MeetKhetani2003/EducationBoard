import mongoose, { Schema, Document } from 'mongoose';

export interface ILegalStatus extends Document {
  title: string;
  reference: string;
  documentUrl?: string;
}

const LegalStatusSchema: Schema = new Schema({
  title: { type: String, required: true },
  reference: { type: String, required: true },
  documentUrl: { type: String }
}, { timestamps: true });

export default (mongoose.models.LegalStatus as mongoose.Model<ILegalStatus>) || mongoose.model<ILegalStatus>('LegalStatus', LegalStatusSchema);
