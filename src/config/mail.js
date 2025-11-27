import nodemailer from 'nodemailer';
import logger from '../application/utils/logger.js';

let parsedPort = Number(process.env.SMTP_PORT);
const port =
  Number.isFinite(parsedPort) && parsedPort > 0 && parsedPort < 65536
    ? parsedPort
    : 587;
let secure = process.env.SMTP_SECURE === 'true';
if (process.env.SMTP_SECURE === undefined) {
  secure = port === 465;
}

const transportConfig = {
  host: process.env.SMTP_HOST,
  port,
  // secure=true for port 465, secure=false for STARTTLS on 587/25
  secure,
  requireTLS: process.env.SMTP_REQUIRE_TLS === 'true',
  pool: process.env.SMTP_POOL === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: process.env.SMTP_DEBUG === 'true',
  debug: process.env.SMTP_DEBUG === 'true',
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT) || 20000,
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT) || 10000,
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT) || 20000,
  tls: {
    // set SMTP_TLS_REJECT_UNAUTHORIZED=false to allow self-signed during testing
    rejectUnauthorized:
      process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'false' ? false : true,
  },
};

export const transporter = nodemailer.createTransport(transportConfig);

// Optional: log sanitized transport config for debugging
if (process.env.SMTP_DEBUG === 'true') {
  if (!(Number.isFinite(parsedPort) && parsedPort > 0 && parsedPort < 65536)) {
    logger.warn(
      `SMTP_PORT env value is invalid (${process.env.SMTP_PORT}); falling back to ${port}`
    );
  }
  const { auth, ...rest } = transportConfig;
  logger.debug('SMTP transport config (sanitized)', {
    config: {
      ...rest,
      auth: { user: auth?.user, pass: auth?.pass ? '***' : undefined },
    },
  });
}

// Verify mail configuration on startup (can be skipped with SMTP_VERIFY=false)
if (process.env.SMTP_VERIFY !== 'false') {
  transporter
    .verify()
    .then(() => logger.info('Mail service is ready'))
    .catch(err => logger.error('Mail service configuration error:', err));
}
