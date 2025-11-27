import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// ensure logs directories
const logDirs = ['logs', 'logs/error', 'logs/combined'];
logDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level}]: ${message} - ${stack}`
        : `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    // Error logs - daily rotation in error folder
    new DailyRotateFile({
      filename: path.join('logs', 'error', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d', // Keep logs for 30 days
      maxSize: '20m', // Rotate when file size exceeds 20MB
      zippedArchive: true,
    }),
    // Combined logs - daily rotation in combined folder
    new DailyRotateFile({
      filename: path.join('logs', 'combined', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      maxSize: '20m',
      zippedArchive: true,
    }),
  ],
});

export default logger;
