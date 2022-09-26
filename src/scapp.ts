import * as fs from 'fs';

export const Scapp = (name: string) => {
  const dir = 'template';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } else {
    console.log('directory exists');
  }

  console.log('fvdgfdgfdgfdgdfffffffffffffffffffffffffffffffffffffffgfdgdfgdfgdf');

  return `Hello ${name}`;
};
