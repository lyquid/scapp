import * as fs from 'fs';
import path from 'path';
import process from 'process';
import * as scapp from '../scapp';

const { removeFile } = scapp.removeFileForTesting;

test('removeFile', () => {
  const fileName = 'main.cpp';
  const fullPath = path.join(process.cwd(), fileName);
  try {
    fs.writeFileSync(fullPath, 'hola manola hola');
  } catch (err) {
    console.error(err);
  }
  removeFile(fullPath);
  expect(fs.existsSync(fullPath)).toBe(false);
});
