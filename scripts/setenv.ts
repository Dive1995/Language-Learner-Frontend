const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;


var environmentFileContent = "";

if (!process.env['GOOGLE_CLIENT_ID'] || !process.env['GOOGLE_API_KEY']) {
   console.error('All the required environment variables were not provided!');

   environmentFileContent = `
   export const environment = {
   production: ${isProduction},
   GOOGLE_CLIENT_ID: "MISSING_CLIENT_ID",
   GOOGLE_API_KEY: "MISSING_API_KEY"
};
`;
   // process.exit(0);
}else{
   environmentFileContent = `
   export const environment = {
      production: ${isProduction},
      GOOGLE_CLIENT_ID: "${process.env['GOOGLE_CLIENT_ID']}",
      GOOGLE_API_KEY: "${process.env['GOOGLE_API_KEY']}"
   };
   `;
}


// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err:any) {
   if (err) {
      console.log(err);
   }

   console.log(`Wrote variables to ${targetPath}`);
});