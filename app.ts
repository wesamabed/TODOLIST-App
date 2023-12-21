import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import initializeDatabase from './database'; // Update the path if necessary
import userRoutes from './routes/User'; // Ensure User.ts exports default
import * as taskRoutes from './routes/'; // Ensure Task.ts exports default

const app = express();
app.use(express.json());

initializeDatabase().then(() => {
    console.log('Database connection established successfully.');
    app.listen(4000, () => {
        console.log('Server running on port 4000');
    });
}).catch((error: any) => {
    console.error('Database initialization failed:', error);
    process.exit(1); 
});

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).send('Page not found');
});

// Centralized Error Handling Middleware
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
};

app.use(errorHandler);
