import mongoose, { Schema, Document } from "mongoose";

export interface IFileNode extends Document {
    name: string;
    projectId: mongoose.Types.ObjectId;
    parentId: mongoose.Types.ObjectId | null;
    isFolder: boolean;
    content: string; // The code content, kept in sync when editor closes or saves
}

const FileNodeSchema = new Schema({
    name: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'FileNode', default: null },
    isFolder: { type: Boolean, default: false },
    content: { type: String, default: "" }, // For text files
});

export const FileNode = mongoose.model<IFileNode>("FileNode", FileNodeSchema);
