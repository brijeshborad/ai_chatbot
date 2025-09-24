const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');
const envConfig = `export const environment = {
  production: true,
  apiBaseUrl: '${process.env.API_BASE_URL || 'http://localhost:8000'}',  // Replace with your sensitive vars
  apiToGenerate: '${process.env.API_TO_GENERATE || 'generate'}',
  // Add more vars as needed, e.g., databaseUrl: process.env.DATABASE_URL
};`;

fs.writeFileSync(targetPath, envConfig);
console.log('Generated environment.prod.ts with env vars');