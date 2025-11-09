import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkillProfile extends Document {
  name: string;
  skills: { name: string; level: string }[];
  createdAt: Date;
}

const SkillSchema = new Schema<ISkillProfile>({
  name: { type: String, required: true },
  skills: { type: [{ name: String, level: String }], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reloads
const SkillModel: Model<ISkillProfile> = (mongoose.models.SkillProfile as Model<ISkillProfile>) || mongoose.model<ISkillProfile>('SkillProfile', SkillSchema);

export default SkillModel;
