const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: String,
    status: {
        type: String,
        enum: ['Completed', 'In Progress', 'Waiting']
    }
});

const userSchema = new Schema({
    name: String,
    tasks: [taskSchema] 
});

const User = mongoose.model('user', userSchema);
module.exports = User;

