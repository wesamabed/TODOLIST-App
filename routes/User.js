"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express = require("express");
const bcrypt = __importStar(require("bcryptjs"));
const User_1 = require("../models/User");
const userValidation_1 = require("../validation/userValidation");
const auth_1 = require("../auth/auth");
const authorization_1 = __importDefault(require("../auth/authorization"));
const router = express.Router();
const requireRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        return next();
    }
    res.status(403).send('Access denied');
};
const adminOrSameUser = (req, res, next) => {
    if (!req.user) {
        return res.status(403).send('Access denied');
    }
    if (req.user.role === 'admin') {
        return next();
    }
    const userIdFromToken = req.user._id;
    const userIdForOperation = req.params.id;
    if (userIdFromToken.toString() === userIdForOperation) {
        return next();
    }
    return res.status(403).send('Access denied');
};
const adminOrAuthenticatedUser = (req, res, next) => {
    if (!req.user) {
        return res.status(403).send('Access denied');
    }
    if (req.user.role === 'admin' || req.user._id) {
        return next();
    }
    return res.status(403).send('Access denied');
};
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = yield (0, auth_1.authenticateUser)(email, password);
        res.json({ token });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(401).send(errorMessage);
    }
}));
router.get('/', authorization_1.default, requireRole('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select('-password');
        res.json(users);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.get('/:id', authorization_1.default, adminOrSameUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.post('/', userValidation_1.validateCreateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }
        let user = new User_1.User(req.body);
        yield user.save();
        res.status(201).send('User created successfully');
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.delete('/:id', authorization_1.default, adminOrSameUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_1.User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${req.params.id} deleted successfully`);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.put('/update-password/:id?', authorization_1.default, adminOrSameUser, userValidation_1.validateChangePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userIdToUpdate = req.params.id || ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const { oldPassword, newPassword } = req.body;
        const user = yield User_1.User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin';
        const isSameUser = userIdToUpdate.toString() === ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString());
        if (!isAdmin || isSameUser) {
            if (!req.body.oldPassword) {
                return res.status(400).send('Old password is required');
            }
            const isMatch = yield bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).send('Invalid old password');
            }
        }
        user.password = newPassword;
        yield user.save();
        res.send('Password changed successfully');
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.put('/update-username', authorization_1.default, adminOrAuthenticatedUser, userValidation_1.validateUpdateUsername, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const { username } = req.body;
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { username }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ username: updatedUser.username });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.put('/update-email', authorization_1.default, adminOrAuthenticatedUser, userValidation_1.validateUpdateEmail, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        const { email } = req.body;
        const existingUser = yield User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { email }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ email: updatedUser.email });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.put('/update-settings', authorization_1.default, adminOrAuthenticatedUser, userValidation_1.validateUpdateSettings, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f._id;
        const { theme, timezone } = req.body;
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { 'settings.theme': theme, 'settings.timezone': timezone }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ settings: updatedUser.settings });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
router.put('/update-notification-settings', authorization_1.default, adminOrAuthenticatedUser, userValidation_1.validateUpdateNotificationSettings, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g._id;
        const notificationSettings = req.body;
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { 'settings.notificationSettings': notificationSettings }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ notificationSettings: updatedUser.settings.notificationSettings });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
}));
exports.default = router;
