import axios from 'axios';
import baseURLs from '../config/config.js';

export const createServiceAPI = (serviceName, token) => {
  if (!baseURLs[serviceName]) {
    throw new Error(`Base URL not found for service: ${serviceName}`);
  }

  const instance = axios.create({
    baseURL: `${baseURLs[serviceName]}/api`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `${token}` }),
    },
  });

  instance.interceptors.request.use(
    config => {
      console.log(
        `[${serviceName.toUpperCase()}] Request → ${config.method?.toUpperCase()} ${config.url}`
      );
      return config;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => {
      console.log(
        `[${serviceName.toUpperCase()}] Response ← ${response.status}`
      );
      return response.data;
    },
    error => {
      if (error.response) {
        console.error(
          `[${serviceName.toUpperCase()}] Error ← ${error.response.status}: ${error.response.data?.message || error.message}`
        );
      } else {
        console.error(
          `[${serviceName.toUpperCase()}] Network/Error: ${error.message}`
        );
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
