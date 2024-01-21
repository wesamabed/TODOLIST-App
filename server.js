"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./database"));
(0, database_1.default)().then(() => {
    console.log('Database connection established successfully.');
    app_1.default.listen(4000, () => {
        console.log('Server running on port 4000');
    });
}).catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
});
