import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    ownerId: string;
    createdAt: Date;
}

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    ownerId: { type: String, required: false }, // Simple auth
    createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
