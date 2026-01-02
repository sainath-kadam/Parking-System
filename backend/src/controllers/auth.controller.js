import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

export async function login(req, res) {
  try {
    const { password } = req.body;

    // single embedded username logic
    const user = await User.findOne({ isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function logout(req, res) {
  // stateless JWT → logout handled client-side
  res.json({ message: 'Logged out successfully' });
}