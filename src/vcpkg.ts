// file system
import * as fs from 'fs';
// path utils
import path from 'path';
// configuration
import { ScappConfig } from './config.js';

export default function vcpkg(SCAPP_CONFIG: ScappConfig) {
  const vcpkgJson = {
    '$schema': 'https://raw.githubusercontent.com/microsoft/vcpkg/master/scripts/vcpkg.schema.json',
    name: SCAPP_CONFIG.appName.toLowerCase().replaceAll('_', '-'),
    version: SCAPP_CONFIG.version,
    description: SCAPP_CONFIG.description
    // dependencies: ['', '']
  };
  try {
    const pathToVcpkgFile = path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.VCPKG_JSON);
    fs.writeFileSync(pathToVcpkgFile, JSON.stringify(vcpkgJson, null, 2));
  } catch (err) {
    console.error(err);
  }
}
