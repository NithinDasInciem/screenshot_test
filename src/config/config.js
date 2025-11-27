import dotenv from 'dotenv';
dotenv.config();

const baseURLs = {
  hrmMs: process.env.HRM_SERVICE_URL,
};

export default baseURLs;
