import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Detect if running on Vercel (serverless)
const isVercel = !!process.env.VERCEL;

// LOCAL DEVELOPMENT — allow log folders & file logging
if (!isVercel) {
  const logDirs = ['logs', 'logs/error', 'logs/combined'];

  logDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

const loggerTransports = [
  // Console output always enabled
  new transports.Console(),
];

// Only enable rotating file logs when NOT on Vercel
if (!isVercel) {
  loggerTransports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'error', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      maxSize: '20m',
      zippedArchive: true,
    }),
    new DailyRotateFile({
      filename: path.join('logs', 'combined', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      maxSize: '20m',
      zippedArchive: true,
    })
  );
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) =>
      stack
        ? `${timestamp} [${level}]: ${message} - ${stack}`
        : `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: loggerTransports,
});

export default logger;
