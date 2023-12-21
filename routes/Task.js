const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { validateTask, validateUpdateTask } = require('../validation/taskValidation');
const User = require('../models/User');


router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate({
                path: 'owner',
                model: 'User',
                match: { _id: { $exists: true } }
            });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// POST a new task
router.post('/', validateTask, async (req, res) => {
    try {
        let task = new Task(req.body);
        await task.save();
        res.status(201).send('Task added successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

router.put('/:id', validateUpdateTask, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


// DELETE a task
router.delete('/:id', async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Task not found');
        }
        res.send(`Task with ID ${req.params.id} deleted successfully`);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

//module.exports = router;
export default router;