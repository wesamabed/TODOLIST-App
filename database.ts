import mongoose from 'mongoose';
import { SSMClient, GetParameterCommand, GetParameterResult, ParameterNotFound } from '@aws-sdk/client-ssm';

// Configuration and Constants
const AWS_REGION = 'eu-north-1';
const DB_CLUSTER_ENDPOINT = 'cluster0.zbugbke.mongodb.net';
const RETRY_WRITES = true;

// Create an SSM client instance for AWS SDK v3
const ssmClient = new SSMClient({
    region: AWS_REGION
});

async function getSecureParameter(name: string): Promise<string> {
    const params = {
        Name: name,
        WithDecryption: true
    };

    try {
        const response: GetParameterResult = await ssmClient.send(new GetParameterCommand(params));
        return response.Parameter?.Value ?? '';
    } catch (error) {
        if (error instanceof ParameterNotFound) {
            console.error(`Parameter not found (${name}):`, error);
        } else {
            console.error(`Error retrieving parameter (${name}):`, error);
        }
        throw error;
    }
}

async function connectToDatabase(username: string, password: string): Promise<void> {
    const connectionString = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ENDPOINT}/?retryWrites=${RETRY_WRITES}&w=majority`;

    try {
        await mongoose.connect(connectionString);
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

async function initializeApp(): Promise<void> {
    try {
        const dbUsername = await getSecureParameter('/nodejs/database-username');
        const dbPassword = await getSecureParameter('/nodejs/database/password');
        
        await connectToDatabase(dbUsername, dbPassword);
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

export default initializeApp;
