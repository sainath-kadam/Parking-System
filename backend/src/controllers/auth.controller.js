import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

export async function login(req, res) {
  try {
    const { password } = req.body;

    const user = await User.findOne({ isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        tenantId: user.tenantId || null
      },
      ENV.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function logout(req, res) {
  res.json({ message: 'Logged out successfully' });
}