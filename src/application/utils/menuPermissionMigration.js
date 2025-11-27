import mongoose from 'mongoose';
import Menu from '../models/menu.model.js';
import Role from '../models/roles.model.js';
import MenuHasPermission from '../models/menuHasPermission.model.js';

/**
 * Migration script to set up MenuHasPermission for existing menus and roles
 * This should be run once after implementing the new MenuHasPermission system
 * MenuHasPermission only controls menu visibility, CRUD permissions are handled by RolesHasPermission
 */
export const setupMenuPermissions = async () => {
  try {
    console.log('Starting menu permissions setup...');

    // Get all active menus
    const menus = await Menu.find({ isDeleted: false, status: 1 });
    console.log(`Found ${menus.length} active menus`);

    // Get all active roles
    const roles = await Role.find({ isDeleted: false });
    console.log(`Found ${roles.length} active roles`);

    if (menus.length === 0 || roles.length === 0) {
      console.log('No menus or roles found. Skipping setup.');
      return;
    }

    const bulkOperations = [];
    let processed = 0;

    for (const role of roles) {
      for (const menu of menus) {
        // Check if permission already exists
        const existingPermission = await MenuHasPermission.findOne({
          menu_id: menu._id,
          role_id: role._id,
          isDeleted: false
        });

        if (!existingPermission) {
          // Default menu visibility based on role type
          let isVisible = true; // Default to visible for all roles

          // Customize visibility based on role name if needed
          const roleName = role.rolename.toLowerCase();
          
          // For example, you might want to hide certain menus from specific roles
          // if (menu.menu === 'admin-panel' && !roleName.includes('admin')) {
          //   isVisible = false;
          // }

          bulkOperations.push({
            insertOne: {
              document: {
                menu_id: menu._id,
                role_id: role._id,
                is_visible: isVisible,
                created_by: null, // System migration
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
          });

          processed++;
        }
      }
    }

    if (bulkOperations.length > 0) {
      await MenuHasPermission.bulkWrite(bulkOperations);
      console.log(`Successfully created ${processed} menu visibility permissions`);
    } else {
      console.log('All menu permissions already exist. No changes needed.');
    }

    console.log('Menu permissions setup completed successfully!');
    return processed;

  } catch (error) {
    console.error('Error setting up menu permissions:', error);
    throw error;
  }
};

/**
 * Cleanup unused menu permissions (optional)
 */
export const cleanupMenuPermissions = async () => {
  try {
    console.log('Starting cleanup of unused menu permissions...');

    // Find permissions with deleted menus or roles
    const unusedPermissions = await MenuHasPermission.find({
      isDeleted: false,
      $or: [
        {
          menu_id: {
            $in: await Menu.find({ $or: [{ isDeleted: true }, { status: 0 }] }).distinct('_id')
          }
        },
        {
          role_id: {
            $in: await Role.find({ isDeleted: true }).distinct('_id')
          }
        }
      ]
    });

    if (unusedPermissions.length > 0) {
      await MenuHasPermission.updateMany(
        {
          _id: { $in: unusedPermissions.map(p => p._id) }
        },
        {
          isDeleted: true,
          updatedAt: new Date()
        }
      );
      
      console.log(`Cleaned up ${unusedPermissions.length} unused menu permissions`);
    } else {
      console.log('No unused menu permissions found');
    }

    return unusedPermissions.length;

  } catch (error) {
    console.error('Error cleaning up menu permissions:', error);
    throw error;
  }
};

// Export for use in migration scripts
export default {
  setupMenuPermissions,
  cleanupMenuPermissions
};
