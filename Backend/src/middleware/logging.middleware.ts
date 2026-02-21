import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log when request starts
  console.log(`📥 ${timestamp} - ${req.method} ${req.originalUrl}`);
  
  // Listen for response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusIcon = getStatusIcon(statusCode);
    
    console.log(`📤 ${timestamp} - ${req.method} ${req.originalUrl} ${statusIcon} ${statusCode} (${duration}ms)`);
  });
  
  next();
};

function getStatusIcon(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return '✅';
  if (statusCode >= 300 && statusCode < 400) return '↩️';
  if (statusCode >= 400 && statusCode < 500) return '⚠️';
  if (statusCode >= 500) return '❌';
  return '❓';
}
