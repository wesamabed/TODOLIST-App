"use strict";
const express = require('express');
const initializeDatabase = require('./database');
const userRoutes = require('./routes/User');
const taskRoutes = require('./routes/Task');
const app = express();
app.use(express.json());
initializeDatabase().then(() => {
    console.log('Database connection established successfully.');
    app.listen(4000, () => {
        console.log('Server running on port 4000');
    });
}).catch(error => {
    console.error('Database initialization failed:', error);
    process.exit(1);
});
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use((req, res) => {
    res.status(404).send('Page not found');
});
// Centralized Error Handling Middleware
app.use((error, req, res, next) => {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
});
