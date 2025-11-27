/**
 * Database Migration Utilities for Soft Delete
 * Utilities to help migrate existing hard delete systems to soft delete
 */

import mongoose from 'mongoose';

/**
 * Add isDeleted field to existing collections
 * @param {Array} collections - Array of collection names
 */
export const addIsDeletedField = async (collections = []) => {
  try {
    const db = mongoose.connection.db;
    
    for (const collectionName of collections) {
      console.log(`🔄 Adding isDeleted field to ${collectionName}...`);
      
      const result = await db.collection(collectionName).updateMany(
        { isDeleted: { $exists: false } },
        { 
          $set: { 
            isDeleted: false,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} documents in ${collectionName}`);
    }
    
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Find records that might need cleanup (very old soft deleted records)
 * @param {String} collectionName - Collection name
 * @param {Number} daysOld - Number of days old (default 365)
 */
export const findOldSoftDeletedRecords = async (collectionName, daysOld = 365) => {
  try {
    const db = mongoose.connection.db;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const oldRecords = await db.collection(collectionName).find({
      isDeleted: true,
      updatedAt: { $lt: cutoffDate }
    }).toArray();
    
    console.log(`📊 Found ${oldRecords.length} old soft-deleted records in ${collectionName}`);
    return oldRecords;
  } catch (error) {
    console.error('❌ Error finding old records:', error);
    throw error;
  }
};

/**
 * Restore soft deleted records based on criteria
 * @param {String} collectionName - Collection name
 * @param {Object} filter - Additional filter criteria
 */
export const bulkRestoreRecords = async (collectionName, filter = {}) => {
  try {
    const db = mongoose.connection.db;
    
    const result = await db.collection(collectionName).updateMany(
      { 
        isDeleted: true,
        ...filter
      },
      { 
        $set: { 
          isDeleted: false,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`✅ Restored ${result.modifiedCount} records in ${collectionName}`);
    return result;
  } catch (error) {
    console.error('❌ Error restoring records:', error);
    throw error;
  }
};

/**
 * Permanently delete old soft deleted records
 * WARNING: This permanently removes data - use with caution!
 * @param {String} collectionName - Collection name
 * @param {Number} daysOld - Minimum age in days for deletion
 * @param {Boolean} dryRun - If true, only shows what would be deleted
 */
export const cleanupOldSoftDeletedRecords = async (collectionName, daysOld = 365, dryRun = true) => {
  try {
    const db = mongoose.connection.db;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const filter = {
      isDeleted: true,
      updatedAt: { $lt: cutoffDate }
    };
    
    if (dryRun) {
      const count = await db.collection(collectionName).countDocuments(filter);
      console.log(`🔍 DRY RUN: Would delete ${count} records from ${collectionName}`);
      return { deletedCount: 0, wouldDelete: count };
    } else {
      console.log(`⚠️  PERMANENTLY deleting old records from ${collectionName}...`);
      const result = await db.collection(collectionName).deleteMany(filter);
      console.log(`🗑️  Permanently deleted ${result.deletedCount} records from ${collectionName}`);
      return result;
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
};

/**
 * Generate migration report for all collections
 */
export const generateMigrationReport = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Soft Delete Migration Report');
    console.log('================================');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      
      // Skip system collections
      if (collectionName.startsWith('system.')) continue;
      
      const [total, withIsDeleted, softDeleted] = await Promise.all([
        db.collection(collectionName).countDocuments({}),
        db.collection(collectionName).countDocuments({ isDeleted: { $exists: true } }),
        db.collection(collectionName).countDocuments({ isDeleted: true })
      ]);
      
      console.log(`\n📁 ${collectionName}:`);
      console.log(`   Total documents: ${total}`);
      console.log(`   With isDeleted field: ${withIsDeleted} (${((withIsDeleted/total)*100).toFixed(1)}%)`);
      console.log(`   Soft deleted: ${softDeleted}`);
      console.log(`   Active: ${total - softDeleted}`);
      
      if (withIsDeleted < total) {
        console.log(`   ⚠️  ${total - withIsDeleted} documents need isDeleted field`);
      }
    }
    
    console.log('\n================================');
  } catch (error) {
    console.error('❌ Error generating report:', error);
    throw error;
  }
};

/**
 * Validate soft delete implementation across collections
 */
export const validateSoftDeleteImplementation = async () => {
  try {
    const db = mongoose.connection.db;
    const issues = [];
    
    // Define expected collections with soft delete
    const expectedCollections = [
      'users',
      'logins',
      'roles', 
      'permissions',
      'menus',
      'rolesmenupermissions',
      'counters'
    ];
    
    console.log('🔍 Validating Soft Delete Implementation...');
    
    for (const collectionName of expectedCollections) {
      try {
        // Check if collection exists
        const collectionInfo = await db.listCollections({ name: collectionName }).toArray();
        if (collectionInfo.length === 0) {
          issues.push(`❌ Collection '${collectionName}' not found`);
          continue;
        }
        
        // Check for documents without isDeleted field
        const missingIsDeleted = await db.collection(collectionName).countDocuments({
          isDeleted: { $exists: false }
        });
        
        if (missingIsDeleted > 0) {
          issues.push(`⚠️  ${collectionName}: ${missingIsDeleted} documents missing isDeleted field`);
        }
        
        // Check for invalid isDeleted values
        const invalidIsDeleted = await db.collection(collectionName).countDocuments({
          isDeleted: { $nin: [true, false] }
        });
        
        if (invalidIsDeleted > 0) {
          issues.push(`❌ ${collectionName}: ${invalidIsDeleted} documents have invalid isDeleted value`);
        }
        
      } catch (error) {
        issues.push(`❌ Error checking ${collectionName}: ${error.message}`);
      }
    }
    
    if (issues.length === 0) {
      console.log('✅ All collections properly implement soft delete!');
    } else {
      console.log('⚠️  Issues found:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    return issues;
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
};

export default {
  addIsDeletedField,
  findOldSoftDeletedRecords,
  bulkRestoreRecords,
  cleanupOldSoftDeletedRecords,
  generateMigrationReport,
  validateSoftDeleteImplementation
};
