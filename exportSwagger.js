import fs from 'fs';
import swaggerSpec from './src/config/swagger.js';

// Export Swagger specification to a JSON file
const outputPath = './export/swagger-export.json';

try {
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
  console.log(`✅ Swagger specification exported successfully to ${outputPath}`);
  console.log(`📦 You can now import this file into Postman, Insomnia, or other API tools`);
} catch (error) {
  console.error('❌ Error exporting Swagger specification:', error);
  process.exit(1);
}
