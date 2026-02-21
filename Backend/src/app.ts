import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/error.middleware';
import { requestLogger } from './middleware/logging.middleware';
import { authenticateToken } from './middleware/auth.middleware';
import { requireRole } from './middleware/role.middleware';
import routes from './routes';
import { JwtPayload } from './modules/auth/auth.validation';
import { 
  corsOptions, 
  helmetConfig, 
  rateLimiter, 
  authRateLimiter, 
  requestSizeLimit, 
  securityHeaders 
} from './config/security.config';
import { DatabaseHealthCheck } from './config/database.config';

const app = express();

// Apply security headers first
app.use(securityHeaders);

// Apply helmet for security
app.use(helmet(helmetConfig));

// Configure CORS with environment variables
app.use(cors(corsOptions));

// Apply rate limiting
app.use(rateLimiter);

// Apply request size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Additional request size validation
app.use(requestSizeLimit('10mb'));

// Apply request logging
app.use(requestLogger);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authRateLimiter);

// Mount routes
app.use('/api', routes);

app.get('/api/protected', authenticateToken, (req: express.Request & { user?: JwtPayload }, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});

app.get('/api/admin', authenticateToken, requireRole(['admin']), (req: express.Request & { user?: JwtPayload }, res) => {
  res.status(200).json({ message: 'Admin access granted', user: req.user });
});

app.get('/health', async (req, res) => {
  try {
    const dbHealth = await DatabaseHealthCheck.checkHealth();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth
    };

    if (dbHealth.status === 'error') {
      return res.status(503).json(health);
    }

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

// Handle 404 errors
app.use(notFound);

// Handle global errors
app.use(errorHandler);

export default app;