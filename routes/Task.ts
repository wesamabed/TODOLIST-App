import express, { Request, Response, Router } from 'express';
import { Task } from '../models/Task';
import { validateTask, validateUpdateTask } from '../validation/taskValidation';
import verifyToken from '../auth/authorization'; // Import the verifyToken middleware

const router: Router = express.Router();

// GET all tasks
router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find()
            .populate('owner', 'username')
            .populate('assignedTo', 'username');
        res.json(tasks);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: errorMessage });
    }
});

// POST a new task
router.post('/', verifyToken, validateTask, async (req: Request, res: Response) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: errorMessage });
    }
});

// PUT (update) a task by ID
router.put('/:id', verifyToken, validateUpdateTask, async (req: Request, res: Response) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: errorMessage });
    }
});

// DELETE a task by ID
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: `Task with ID ${req.params.id} deleted successfully` });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: errorMessage });
    }
});

export default router;
