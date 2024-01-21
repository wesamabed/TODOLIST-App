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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Task_1 = require("../models/Task");
const taskValidation_1 = require("../validation/taskValidation"); // Adjust import path
const User_1 = require("../models/User");
const router = express.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.Task.find()
            .populate({
            path: 'owner',
            model: User_1.User,
            match: { _id: { $exists: true } }
        });
        res.json(tasks);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(401).send(errorMessage);
    }
}));
router.post('/', taskValidation_1.validateTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let task = new Task_1.Task(req.body);
        yield task.save();
        res.status(201).send('Task added successfully');
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(401).send(errorMessage);
    }
}));
router.put('/:id', taskValidation_1.validateUpdateTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedTask = yield Task_1.Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.json(updatedTask);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(401).send(errorMessage);
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Task_1.Task.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Task not found');
        }
        res.send(`Task with ID ${req.params.id} deleted successfully`);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(401).send(errorMessage);
    }
}));
exports.default = router;
