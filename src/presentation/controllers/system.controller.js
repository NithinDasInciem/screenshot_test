import * as systemService from '../../application/services/system.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

/**
 * Clean up orphaned role-menu permission records
 */
export const cleanupOrphanedRecords = async (req, res, next) => {
  try {
    // Delegate business logic to the system service
    const result = await systemService.cleanupOrphanedRecords(req.user?._id);

    ApiResponse.success('Orphaned records cleanup completed', result).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get system health check for role-permission system
 */
export const getSystemHealth = async (req, res, next) => {
  try {
    // Delegate business logic to the system service
    const healthData = await systemService.getSystemHealth();

    ApiResponse.success('System health check completed', healthData).send(res);
  } catch (error) {
    next(error);
  }
};
