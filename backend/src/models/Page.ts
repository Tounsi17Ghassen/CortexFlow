// backend/src/models/Page.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  icon?: string;
  cover?: string;
  blocks: string[];
  properties: {
    description?: string;
    tags: string[];
    authors: string[];
    lastViewed?: Date;
    views: number;
  };
  parentId?: string;
  workspaceId: string;
  createdBy: string;
  lastEditedBy: string;
  archived: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema({
  title: { type: String, required: true },
  icon: String,
  cover: String,
  blocks: [{ type: String }],
  properties: {
    description: String,
    tags: [{ type: String }],
    authors: [{ type: String }],
    lastViewed: Date,
    views: { type: Number, default: 0 }
  },
  parentId: String,
  workspaceId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  lastEditedBy: { type: String, required: true },
  archived: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
}, { timestamps: true });

PageSchema.index({ workspaceId: 1, title: 1 });
PageSchema.index({ 'properties.tags': 1 });

export const Page = mongoose.model<IPage>('Page', PageSchema);
