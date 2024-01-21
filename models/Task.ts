import mongoose, { Schema, Document, Types } from 'mongoose';

interface IComment extends Document {
    content: string;
    author: Types.ObjectId; 
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Todo' | 'In Progress' | 'Done';
    owner: Types.ObjectId; // Reference to User
    assignedTo: Types.ObjectId; // Reference to User
    categories: Types.ObjectId[]; // References to TagCategory
    reminders: Date[];
    subTasks: Types.ObjectId[]; // References to Task
    comments: IComment[];
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TagCategory' }],
    reminders: [{ type: Date }],
    subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], 
    comments: [commentSchema]
}, { timestamps: true });

export const Task = mongoose.model<ITask>('Task', taskSchema);
