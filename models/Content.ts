import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  key: string;
  type: 'text' | 'html' | 'json';
  value: any;
  description?: string;
}

const ContentSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  type: { type: String, enum: ['text', 'html', 'json'], required: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String }
}, { timestamps: true });

export default (mongoose.models.Content as mongoose.Model<IContent>) || mongoose.model<IContent>('Content', ContentSchema);
