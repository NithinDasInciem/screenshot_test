import * as mailService from '../../application/services/mail.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

export const sendMail = async (req, res, next) => {
  try {
    // Delegate business logic to the mail service
    const result = await mailService.sendGenericEmail(req.body);
    // Send the successful response
    ApiResponse.success('Email sent successfully', result).send(res);
  } catch (err) {
    next(err);
  }
};

export const sendWelcome = async (req, res, next) => {
  try {
    const message = await mailService.sendWelcome(req.body);
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

export const sendPasswordReset = async (req, res, next) => {
  try {
    const message = await mailService.sendPasswordReset(req.body);
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};
