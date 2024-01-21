import app from './app';
import initializeDatabase from './database';

initializeDatabase().then(() => {
    console.log('Database connection established successfully.');
    app.listen(4000, () => {
        console.log('Server running on port 4000');
    });
}).catch((error: Error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
});
