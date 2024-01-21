import express = require('express');
import { Application, Request, Response, NextFunction, Router } from 'express';
import * as bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { validateCreateUser, validateChangePassword, validateUpdateUsername, validateUpdateEmail, validateUpdateSettings, validateUpdateNotificationSettings } from '../validation/userValidation';
import { authenticateUser } from '../auth/auth';
import verifyToken from '../auth/authorization';

const router: Router = express.Router();

interface CustomRequest extends Request {
    user?: IUser;
}

const requireRole = (role: string) => (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === role) {
        return next();
    }
    res.status(403).send('Access denied');
};

const adminOrSameUser = (req: CustomRequest, res: Response, next: NextFunction) => {
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

const adminOrAuthenticatedUser = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(403).send('Access denied');
    }

    if (req.user.role === 'admin' || req.user._id) {
        return next();
    }

    return res.status(403).send('Access denied');
};

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await authenticateUser(email, password);
        res.json({ token });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(401).send(errorMessage);
    }
});

router.get('/', verifyToken, requireRole('admin'), async (req: CustomRequest, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.get('/:id', verifyToken, adminOrSameUser, async (req: CustomRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.post('/', validateCreateUser, async (req: Request, res: Response) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }
        let user = new User(req.body);
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.delete('/:id', verifyToken, adminOrSameUser, async (req: CustomRequest, res: Response) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${req.params.id} deleted successfully`);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.put('/update-password/:id?', verifyToken, adminOrSameUser, validateChangePassword, async (req: CustomRequest, res: Response) => {
    try {
        const userIdToUpdate: String = req.params.id || req.user?._id;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isAdmin = req.user?.role === 'admin';
        const isSameUser = userIdToUpdate.toString() === req.user?._id.toString();
        if (!isAdmin || isSameUser) {
            if (!req.body.oldPassword) {
                return res.status(400).send('Old password is required');
            }
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).send('Invalid old password');
            }
        }
        user.password = newPassword;
        await user.save();
        res.send('Password changed successfully');
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.put('/update-username', verifyToken, adminOrAuthenticatedUser, validateUpdateUsername, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { username } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, { username }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ username: updatedUser.username });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.put('/update-email', verifyToken, adminOrAuthenticatedUser, validateUpdateEmail, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { email } = req.body;
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { email }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ email: updatedUser.email });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.put('/update-settings', verifyToken, adminOrAuthenticatedUser, validateUpdateSettings, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { theme, timezone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 'settings.theme': theme, 'settings.timezone': timezone },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json({ settings: updatedUser.settings });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

router.put('/update-notification-settings', verifyToken, adminOrAuthenticatedUser, validateUpdateNotificationSettings, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const notificationSettings = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 'settings.notificationSettings': notificationSettings },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json({ notificationSettings: updatedUser.settings.notificationSettings });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send('Internal Server Error: ' + errorMessage);
    }
});

export default router;
