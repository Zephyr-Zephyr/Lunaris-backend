import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { generateToken } from '../utils/jwt';
import emailService from './EmailService';

interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Partial<User>;
}

class AuthService {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [payload.email]);

      if (existingUser.rows.length > 0) {
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(payload.password, salt);

      // Create user
      const result = await query(
        'INSERT INTO users (email, password_hash, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name, created_at',
        [payload.email, passwordHash, payload.name]
      );

      const user = result.rows[0];

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.name);

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
      });

      return {
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration',
      };
    }
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      // Find user
      const result = await query('SELECT id, email, name, password_hash FROM users WHERE email = $1', [
        payload.email,
      ]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const user = result.rows[0];

      // Compare password
      const isPasswordValid = await bcrypt.compare(payload.password, user.password_hash);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
      });

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }

  async getUserById(id: number): Promise<Partial<User> | null> {
    try {
      const result = await query('SELECT id, email, name, created_at FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}

export default new AuthService();
