import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import {User, IUser } from '../models/User'; 
interface CustomRequest extends Request {
    user?: IUser;
}

const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Set a secret key for JWT

const authenticateUser = async (email: string, password: string): Promise<string> => {
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
    return token;
};

export { authenticateUser };
