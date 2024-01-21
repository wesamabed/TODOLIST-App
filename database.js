"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const client_ssm_1 = require("@aws-sdk/client-ssm");
// Configuration and Constants
const AWS_REGION = 'eu-north-1';
const DB_CLUSTER_ENDPOINT = 'cluster0.zbugbke.mongodb.net';
const RETRY_WRITES = true;
// Create an SSM client instance for AWS SDK v3
const ssmClient = new client_ssm_1.SSMClient({
    region: AWS_REGION
});
function getSecureParameter(name) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Name: name,
            WithDecryption: true
        };
        try {
            const response = yield ssmClient.send(new client_ssm_1.GetParameterCommand(params));
            return (_b = (_a = response.Parameter) === null || _a === void 0 ? void 0 : _a.Value) !== null && _b !== void 0 ? _b : '';
        }
        catch (error) {
            if (error instanceof client_ssm_1.ParameterNotFound) {
                console.error(`Parameter not found (${name}):`, error);
            }
            else {
                console.error(`Error retrieving parameter (${name}):`, error);
            }
            throw error;
        }
    });
}
function connectToDatabase(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const connectionString = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ENDPOINT}/?retryWrites=${RETRY_WRITES}&w=majority`;
        try {
            yield mongoose_1.default.connect(connectionString);
            console.log('Database connection successful');
        }
        catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    });
}
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbUsername = yield getSecureParameter('/nodejs/database-username');
            const dbPassword = yield getSecureParameter('/nodejs/database/password');
            yield connectToDatabase(dbUsername, dbPassword);
        }
        catch (error) {
            console.error('Error during app initialization:', error);
        }
    });
}
exports.default = initializeApp;
