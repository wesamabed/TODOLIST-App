const mongoose = require('mongoose');
const AWS = require('aws-sdk');

// Configuration and Constants
const AWS_REGION = 'eu-north-1';
const DB_CLUSTER_ENDPOINT = 'cluster0.zbugbke.mongodb.net';
const RETRY_WRITES = true;
const WRITE_CONCERN = 'majority';

// AWS SSM (Parameter Store) Configuration
AWS.config.update({ region: AWS_REGION });
const ssm = new AWS.SSM();

async function getSecureParameter(name) {
    const params = {
        Name: name,
        WithDecryption: true 
    };

    try {
        const response = await ssm.getParameter(params).promise();
        return response.Parameter.Value;
    } catch (error) {
        console.error(`Error retrieving parameter (${name}):`, error);
        throw error; 
    }
}

async function connectToDatabase(username, password) {
    const connectionString = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ENDPOINT}/?retryWrites=${RETRY_WRITES}&w=majority`;

    try {
        await mongoose.connect(connectionString);
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error; 
    }
}

async function initializeApp() {
    try {
        const dbUsername = await getSecureParameter('/nodejs/database-username');
        const dbPassword = await getSecureParameter('/nodejs/database/password');
        
        await connectToDatabase(dbUsername, dbPassword);
    } catch (error) {
        console.error('Error during app initialization:', error);
        
    }
}

module.exports = initializeApp;
