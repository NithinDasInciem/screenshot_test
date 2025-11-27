import * as menuRepository from '../../data/repositories/menu.repository.js';
import * as roleRepository from '../../data/repositories/role.repository.js';
import * as rmpRepository from '../../data/repositories/roleMenuPermission.repository.js';
import logger from '../utils/logger.js';

/**
 * Cleans up orphaned role-menu permission records.
 * An orphaned record is one where the associated role or menu has been soft-deleted.
 * This implementation is optimized to avoid loops and use bulk database operations.
 * @param {string} [userId=null] - The ID of the user performing the cleanup (optional, for logging).
 * @returns {Promise<object>} An object with the results of the cleanup operation.
 */
export const cleanupOrphanedRecords = async (userId = null) => {
  logger.info('Starting cleanup of orphaned role-menu permission records...');

  // 1. Get all valid, active role and menu IDs
  const [activeRoleIds, activeMenuIds] = await Promise.all([
    roleRepository.distinct('_id', { isDeleted: false }),
    menuRepository.distinct('_id', { isDeleted: false }),
  ]);

  // 2. Find all permissions that are NOT deleted but have a role or menu that IS deleted
  const orphanedPermissions = await rmpRepository.find(
    {
      isDeleted: false,
      $or: [
        { role_id: { $nin: activeRoleIds } },
        { menu_id: { $nin: activeMenuIds } },
      ],
    },
    '_id role_id menu_id'
  );

  if (orphanedPermissions.length === 0) {
    logger.info('No orphaned records found. Cleanup not needed.');
    return {
      orphanedRecordsDeleted: 0,
      deletedRoleIds: [],
      deletedMenuIds: [],
    };
  }

  const orphanedPermissionIds = orphanedPermissions.map(p => p._id);

  // 3. Soft-delete the orphaned records in a single operation
  const updateResult = await rmpRepository.updateMany(
    { _id: { $in: orphanedPermissionIds } },
    { $set: { isDeleted: true, updated_by: userId } }
  );

  const result = {
    orphanedRecordsDeleted: updateResult.modifiedCount,
  };

  logger.info('Cleanup completed:', result);
  return result;
};

/**
 * Checks the health of the system, focusing on data integrity between roles, menus, and permissions.
 * @returns {Promise<object>} An object containing a detailed system health report.
 */
export const getSystemHealth = async () => {
  logger.info('Performing system health check...');

  // 1. Concurrently count totals and get active IDs for checking orphans
  const [
    totalRoles,
    totalMenus,
    totalRoleMenuPermissions,
    activeRoleIds,
    activeMenuIds,
  ] = await Promise.all([
    roleRepository.countDocuments({ isDeleted: false }),
    menuRepository.countDocuments({ isDeleted: false }),
    rmpRepository.countDocuments({ isDeleted: false }),
    roleRepository.distinct('_id', { isDeleted: false }),
    menuRepository.distinct('_id', { isDeleted: false }),
  ]);

  // 2. Efficiently count orphaned records in a single query
  const orphanedCount = await rmpRepository.countDocuments({
    isDeleted: false,
    $or: [
      { role_id: { $nin: activeRoleIds } },
      { menu_id: { $nin: activeMenuIds } },
    ],
  });

  const healthData = {
    system: {
      status: orphanedCount === 0 ? 'healthy' : 'needs_attention',
      lastChecked: new Date().toISOString(),
    },
    statistics: {
      roles: totalRoles,
      menus: totalMenus,
      roleMenuAssociations: totalRoleMenuPermissions,
    },
    issues: {
      orphanedRecords: orphanedCount,
    },
    recommendations: [],
  };

  if (orphanedCount > 0) {
    healthData.recommendations.push(
      'Run the POST /api/system/cleanup endpoint to remove orphaned role-menu permission records.'
    );
  }

  logger.info('System health check completed.', {
    status: healthData.system.status,
  });
  return healthData;
};
