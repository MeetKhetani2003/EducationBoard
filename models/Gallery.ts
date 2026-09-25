import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  mediaType: string;
  category: string;
}

const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mediaType: { type: String, default: 'image' },
  category: { type: String, required: true } // e.g. 'Events', 'Examinations', 'Students'
}, { timestamps: true });

export default (mongoose.models.Gallery as mongoose.Model<IGallery>) || mongoose.model<IGallery>('Gallery', GallerySchema);
