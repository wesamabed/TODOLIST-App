import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';


interface INotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
}

const notificationSettingsSchema = new Schema<INotificationSettings>({
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: false }
});

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'manager';
    settings: {
        notificationSettings: INotificationSettings;
        theme: 'light' | 'dark' | 'auto';
        timezone: string;
    };
    tasks: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
    settings: {
        notificationSettings: notificationSettingsSchema,
        theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
        timezone: { type: String, default: 'UTC' }
    }
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

export const User = mongoose.model<IUser>('User', userSchema);
