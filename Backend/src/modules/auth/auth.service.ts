import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { LoginRequest, AuthResponse, JwtPayload } from './auth.validation';

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.jwtSecret) as JwtPayload;
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const mockUser = {
      id: '1',
      email: 'admin@example.com',
      password: '$2b$10$z128gHFIpPLbhM78OPe0Peq067FOSQJUb9Z3Z8vkxR2y9H03yhk9W', // 'admin123'
      role: 'admin'
    };

    if (loginData.email !== mockUser.email) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.comparePassword(loginData.password, mockUser.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role
    });

    return {
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      }
    };
  }
}