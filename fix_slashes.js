const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/frontend/src/services';
// Added support for TS generics like .post<ApiResponse<T>>
const pattern = /(\.(get|post|patch|put|delete)(?:<[\s\S]*?>)?\s*\(\s*)(['"`])\/([^\/][^'"`]*?)(['"`])/g;

fs.readdirSync(directory).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(pattern, '$1$3$4$5');
    
    if (newContent !== content) {
      console.log(`Updating ${file}`);
      fs.writeFileSync(filePath, newContent, 'utf8');
    } else {
      console.log(`Skipping ${file}`);
    }
  }
});
