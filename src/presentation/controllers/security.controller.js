import * as securityService from '../../application/services/security.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

export const getSecuritySettings = async (req, res, next) => {
  try {
    const settings = await securityService.getSecuritySettings();
    ApiResponse.success(
      'Security settings retrieved successfully',
      settings
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const upsertSecuritySettings = async (req, res, next) => {
  try {
    const updatedSettings = await securityService.upsertSecuritySettings(
      req.body
    );
    ApiResponse.success(
      'Security settings updated successfully',
      updatedSettings
    ).send(res);
  } catch (error) {
    next(error);
  }
};
