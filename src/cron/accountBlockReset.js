import cron from 'node-cron';
import * as loginRepository from '../data/repositories/login.repository.js';
import { createServiceAPI } from '../config/api.js';
import logger from '../application/utils/logger.js';

// Schedule tasks to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Starting account unlock cron job...');

    // Find all locked user accounts where lockUntil is in the past
    const lockedUsers = await loginRepository.find({
      accountLocked: true,
      lockUntil: { $lte: new Date() },
    });

    logger.info(`Found ${lockedUsers.length} accounts to unlock.`);

    // Loop through each locked user and unlock their account
    for (const user of lockedUsers) {
      // Call HRM microservice to update employee status to Active
      try {
        const hrmApi = createServiceAPI('hrmMs');
        await hrmApi.patch(`/employee/update-employee-status`, {
          id: user.user_id,
          status: 'Active',
        });

        // Update the login record to unlock the account
        await loginRepository.findByIdAndUpdate(user._id, {
          accountLocked: false,
          lockUntil: null,
          failedLoginAttempts: 0,
        });

        logger.info(`Account unlocked for user ID: ${user.user_id}`);
      } catch (error) {
        logger.error(
          `Failed to update employee status in HRM service or unlock account for user ID: ${user.user_id}`,
          error.message
        );
      }
    }
    logger.info('Account unlock cron job completed.');
  } catch (error) {
    logger.error('Error running account unlock cron job:', error.message);
  }
});
