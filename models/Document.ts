import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDoc extends MongooseDocument {
  title: string;
  category: string;
  gridFsId: mongoose.Types.ObjectId;
  filename: string;
  contentType: string;
  size: number;
}

const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'Notice', 'Syllabus', 'Result'
  gridFsId: { type: Schema.Types.ObjectId, required: true },
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true }
}, { timestamps: true });

export default (mongoose.models.Document as mongoose.Model<IDoc>) || mongoose.model<IDoc>('Document', DocumentSchema);
