// file system
import * as fs from 'fs';
// path utils
import path from 'path';
// configuration
import { ScappConfig } from './config.js';

/**
 * Does CMake related tasks :P
 * @param SCAPP_CONFIG The config of the app.
 */
export default function cmake(SCAPP_CONFIG: ScappConfig) {
  const mainCmakeListsPath = path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.CMAKELISTS_FILE);
  const srcCmakeListsPath  = path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.SRC_FOLDER, SCAPP_CONFIG.CMAKELISTS_FILE);
  // update MAIN CMakeLists.txt
  try {
    let cmakeListsTxt = fs.readFileSync(mainCmakeListsPath, 'utf8');
    if (SCAPP_CONFIG.srcFolder) {
      // replace the source folder's name on add_subdirectory(src)
      cmakeListsTxt = cmakeListsTxt.replace('add_subdirectory(src)', `add_subdirectory(${SCAPP_CONFIG.srcFolderName})`);
    } else {
      // delete add_subdirectory(src)
      cmakeListsTxt = cmakeListsTxt.replace('add_subdirectory(src)', '');
      // add config from the src/CMakeLists.txt
      const srcCmakeListsTxt = fs.readFileSync(srcCmakeListsPath, 'utf8');
      cmakeListsTxt = cmakeListsTxt + '\n' + srcCmakeListsTxt;
      // src/CMakeLists.txt standard
      cmakeListsTxt = cmakeListsTxt.replace('cxx_std_17', `cxx_std_${SCAPP_CONFIG.standard}`);
      // main file
      if (SCAPP_CONFIG.addMain) {
        // replace the main file if needed
        if (SCAPP_CONFIG.mainFileName !== SCAPP_CONFIG.MAIN_FILE_NAME) {
          cmakeListsTxt = cmakeListsTxt.replace(SCAPP_CONFIG.MAIN_FILE_NAME, SCAPP_CONFIG.mainFileName);
        }
      } else {
        // no main file
        cmakeListsTxt = cmakeListsTxt.replace('../main.cpp', '#../main.cpp');
      }
    }
    // replace the app name
    cmakeListsTxt = cmakeListsTxt.replaceAll('AWESOME_CPP_CMAKE_NAME', SCAPP_CONFIG.appName);
    // replace the C++ standard
    cmakeListsTxt = cmakeListsTxt.replace('CMAKE_CXX_STANDARD 17', `CMAKE_CXX_STANDARD ${SCAPP_CONFIG.standard}`);
    // write back to the file
    fs.writeFileSync(mainCmakeListsPath, cmakeListsTxt);
  } catch (err) {
    console.error(err);
  }
  // update source folder's CMakeLists.txt, if there's source folder
  if (SCAPP_CONFIG.srcFolder) {
    try {
      let srcCmakeListsTxt = fs.readFileSync(srcCmakeListsPath, 'utf8');
      // replace the app name
      srcCmakeListsTxt = srcCmakeListsTxt.replaceAll('AWESOME_CPP_CMAKE_NAME', SCAPP_CONFIG.appName);
      // main file
      if (SCAPP_CONFIG.addMain) {
        // replace the main file if needed
        if (SCAPP_CONFIG.mainFileName !== SCAPP_CONFIG.MAIN_FILE_NAME) {
          srcCmakeListsTxt = srcCmakeListsTxt.replace(SCAPP_CONFIG.MAIN_FILE_NAME, SCAPP_CONFIG.mainFileName);
        }
      } else {
        // no main file
        srcCmakeListsTxt = srcCmakeListsTxt.replace('../main.cpp', '#../main.cpp');
      }
      // replace the C++ standard
      srcCmakeListsTxt = srcCmakeListsTxt.replace('cxx_std_17', `cxx_std_${SCAPP_CONFIG.standard}`);
      // write back to the file
      fs.writeFileSync(srcCmakeListsPath, srcCmakeListsTxt);
    } catch (err) {
      console.error(err);
    }
  }
}
