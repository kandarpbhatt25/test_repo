import { config } from 'dotenv';

// Load environment variables
config();

export interface EnvConfig {
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  CORS_ORIGIN?: string;
  RATE_LIMIT_WINDOW_MS?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;
  AUTH_RATE_LIMIT_WINDOW_MS?: string;
  AUTH_RATE_LIMIT_MAX_REQUESTS?: string;
  NODE_ENV?: string;
  PORT?: string;
}

export function validateEnvironment(): EnvConfig {
  const requiredVars = ['JWT_SECRET'];
  const missingVars: string[] = [];

  // Check required environment variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  // Fail fast if required variables are missing
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please set these environment variables and restart the server.');
    console.error('📝 See .env.example for reference.');
    process.exit(1);
  }

  // Set defaults for optional variables
  const env: EnvConfig = {
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    AUTH_RATE_LIMIT_WINDOW_MS: process.env.AUTH_RATE_LIMIT_WINDOW_MS,
    AUTH_RATE_LIMIT_MAX_REQUESTS: process.env.AUTH_RATE_LIMIT_MAX_REQUESTS,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '3000'
  };

  // Log environment (excluding sensitive data)
  console.log('🔧 Environment Configuration:');
  console.log(`   - NODE_ENV: ${env.NODE_ENV}`);
  console.log(`   - PORT: ${env.PORT}`);
  console.log(`   - JWT_EXPIRY: ${env.JWT_EXPIRY}`);
  console.log(`   - CORS_ORIGIN: ${env.CORS_ORIGIN || 'default (localhost)'}`);
  console.log(`   - RATE_LIMIT_MAX_REQUESTS: ${env.RATE_LIMIT_MAX_REQUESTS || 'default (100)'}`);
  console.log(`   - AUTH_RATE_LIMIT_MAX_REQUESTS: ${env.AUTH_RATE_LIMIT_MAX_REQUESTS || 'default (5)'}`);
  console.log(`   - JWT_SECRET: ${env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);

  return env;
}

export const env = validateEnvironment();
