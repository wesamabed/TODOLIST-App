const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['Email', 'SMS', 'Push'], required: true },
    content: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
