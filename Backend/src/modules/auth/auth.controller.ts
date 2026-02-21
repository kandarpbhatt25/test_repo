import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { LoginRequest } from './auth.validation';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;
      
      if (!loginData.email || !loginData.password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(loginData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}