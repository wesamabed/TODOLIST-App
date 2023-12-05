const mongoose = require('mongoose');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-north-1' });
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
        console.error('Error retrieving parameter:', error);
        throw error;
    }
}

async function initializeApp() {
    try {
        
        const dbPassword = await getSecureParameter('/nodejs/database/password');
        const dpusername = await getSecureParameter('/nodejs/database-username');
        await mongoose.connect(`mongodb+srv://${dpusername}:${dbPassword}@cluster0.zbugbke.mongodb.net/?retryWrites=true&w=majority`);
        console.log('Connection successful');
    } catch (error) {
        console.error('Error during initialization:', error);
        
    }
}

module.exports = initializeApp;
