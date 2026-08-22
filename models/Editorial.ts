import mongoose, { Schema, Document } from 'mongoose';

export interface IEditorial extends Document {
  title: string;
  kind: 'News' | 'Notices';
  category: string;
  publishDate: Date;
  summary: string;
  content: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  imageUrl?: string;
}

const EditorialSchema: Schema = new Schema({
  title: { type: String, required: true },
  kind: { type: String, enum: ['News', 'Notices'], required: true },
  category: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  summary: { type: String },
  content: { type: String },
  status: { type: String, enum: ['Published', 'Scheduled', 'Draft'], default: 'Published' },
  imageUrl: { type: String }
}, { timestamps: true });

export default (mongoose.models.Editorial as mongoose.Model<IEditorial>) || mongoose.model<IEditorial>('Editorial', EditorialSchema);
