// backend/src/models/Block.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
  type: string;
  content: any;
  properties: {
    align?: string;
    color?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
    locked?: boolean;
    hidden?: boolean;
  };
  children: string[];
  parentId?: string;
  pageId: string;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'heading1', 'heading2', 'heading3', 'bullet-list', 'numbered-list',
      'todo', 'toggle', 'code', 'quote', 'divider', 'image', 'video', 'file',
      'table', 'board', 'calendar', 'timeline', 'database']
  },
  content: { type: Schema.Types.Mixed, required: true },
  properties: {
    align: String,
    color: String,
    backgroundColor: String,
    width: Number,
    height: Number,
    locked: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false }
  },
  children: [{ type: String }],
  parentId: String,
  pageId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  version: { type: Number, default: 1 }
}, { timestamps: true });

BlockSchema.index({ pageId: 1, createdAt: -1 });

export const Block = mongoose.model<IBlock>('Block', BlockSchema);
