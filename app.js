const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const app = express();
app.use(express.json());
const initializeApp = require('./database');
initializeApp().then(() => {
    app.listen(4000, () => {
        console.log('Server is running on port 4000');
    });
}).catch(error => {
    console.error('Failed to start the server:', error);
});
const User = require('./models/user');
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


const userSchema = Joi.object({
    name: Joi.string().required(),
    tasks: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        status: Joi.string().required()
    }))
});

const taskSchema = Joi.object({
    title: Joi.string().required(),
    status: Joi.string().required()
});

function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

function validateTask(req, res, next) {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

const updateUserSchema = Joi.object({
    name: Joi.string(),
    tasks: Joi.array().items(Joi.object({
        taskId: Joi.number().integer().required(),
        title: Joi.string().optional(),
        status: Joi.string().optional()
    }))
}).min(1).unknown(false);

function validateUpdate(req, res, next) {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

const updateTaskSchema = Joi.object({
    title: Joi.string(),
    status: Joi.string()
}).min(1).unknown(false);

function validateTaskUpdate(req, res, next) {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}


app.post('/users', validateUser, async (req, res) => {
    try {
        let user = new User(req.body);
        await user.save();
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.delete('/users/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${req.params.id} deleted successfully`);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


app.put('/users/:id', validateUpdate, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${req.params.id} updated successfully`);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


app.get('/tasks', async (req, res) => {
    try {
        const users = await User.find();
        const tasks = users.map(user => user.tasks).flat();
        res.send(tasks);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


app.get('/user/:userId/task/:taskId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User Not Found');
        }
        const task = user.tasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send('Internal Server Error: ', + error.message);
    }
});


app.delete('/user/:userId/task/:taskId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const taskId = req.params.taskId;
        const result = await User.updateOne(
            { _id: userId },
            { $pull: { tasks: { _id: taskId } } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send('Task not found or User not found');
        }
        res.send(`Task with ID ${taskId} deleted successfully`);
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

app.put('/user/:userId/task/:taskId', validateTaskUpdate, async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const updatedtask = req.body;
        const result = await User.updateOne(
            { _id: userId, "tasks._id": taskId },
            { $set: { "tasks.$": updatedtask } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('User or Task not found');
        }

        res.send(`Task with ID ${taskId} updated successfully`);
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});



app.post('/user/:userId', validateTask, async (req, res) => {
    try {
        const userId = req.params.userId;
        let newtask = req.body;
        const result = await User.updateOne(
            { _id: userId },
            { $push: { tasks: newtask } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(201).send(`Task added successfully to user ${userId}`);
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});