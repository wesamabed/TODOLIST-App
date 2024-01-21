"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const User_1 = __importDefault(require("./routes/User"));
const Task_1 = __importDefault(require("./routes/Task"));
const app = express();
app.use(express.json());
app.use('/users', User_1.default);
app.use('/tasks', Task_1.default);
app.use((req, res) => {
    res.status(404).send('Page not found');
});
app.use((error, req, res, next) => {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
});
exports.default = app;
