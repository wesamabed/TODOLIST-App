import mongoose, { Schema, Document, Types } from 'mongoose';

interface INotification extends Document {
    type: 'Email' | 'SMS' | 'Push';
    content: string;
    recipient: Types.ObjectId; // Reference to User
    task: Types.ObjectId; // Reference to Task
}

const notificationSchema = new Schema<INotification>({
    type: { type: String, enum: ['Email', 'SMS', 'Push'], required: true },
    content: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
