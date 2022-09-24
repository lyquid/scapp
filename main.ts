const fs = require('fs');

const dir = 'template';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
} else {
  console.log("directory exists");
}

console.log("fvdgfdgfdgfdgdfgfdgdfgdfgdf");
