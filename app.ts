import express = require('express');
import { Application, Request, Response, NextFunction, Router } from 'express';
import userRoutes from './routes/User';
import taskRoutes from './routes/Task';

const app: Application = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use((req: Request, res: Response) => {
    res.status(404).send('Page not found');
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
});

export default app;
