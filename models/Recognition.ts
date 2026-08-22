import mongoose, { Schema, Document } from 'mongoose';

export interface IRecognition extends Document {
  title: string;
  reference: string;
  documentUrl?: string;
}

const RecognitionSchema: Schema = new Schema({
  title: { type: String, required: true },
  reference: { type: String, required: true },
  documentUrl: { type: String }
}, { timestamps: true });

export default (mongoose.models.Recognition as mongoose.Model<IRecognition>) || mongoose.model<IRecognition>('Recognition', RecognitionSchema);
