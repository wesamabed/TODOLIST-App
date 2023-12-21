const mongoose = require('mongoose');

const tagCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['tag', 'category'] },
    description: { type: String, trim: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function() { return this.type === 'category'; } }
}, { timestamps: true });

module.exports = mongoose.model('TagCategory', tagCategorySchema);
