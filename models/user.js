const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const notificationSettingsSchema = new mongoose.Schema({
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
    settings: {
        notificationSettings: notificationSettingsSchema,
        theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
        timezone: { type: String, default: 'UTC' }
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
