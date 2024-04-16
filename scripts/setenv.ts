const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';

if (!process.env['GOOGLE_CLIENT_ID']) {
    console.error('All the required environment variables were not provided!');
    process.exit(-1);
 }

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   GOOGLE_CLIENT_ID: "${process.env['GOOGLE_CLIENT_ID']}"
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err:any) {
   if (err) {
      console.log(err);
   }

   console.log(`Wrote variables to ${targetPath}`);
});