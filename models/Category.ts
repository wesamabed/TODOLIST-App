import mongoose, { Schema, Document, Types } from 'mongoose';

interface ITagCategory extends Document {
    name: string;
    type: 'tag' | 'category';
    description?: string;
    tasks: Types.ObjectId[]; // Array of references to Task
    owner: Types.ObjectId; // Reference to User
}

const tagCategorySchema = new Schema<ITagCategory>({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['tag', 'category'] },
    description: { type: String, trim: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.type === 'category'; }
    }
}, { timestamps: true });

export const TagCategory = mongoose.model<ITagCategory>('TagCategory', tagCategorySchema);
