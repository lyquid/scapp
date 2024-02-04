/**
 * Interface used to store configuration options for the app.
 */
export interface ScappConfig {
  /**
   * Add a main.cpp file?
   */
  addMain: boolean,
  /**
   * The name of the app to scaffold.
   */
  appName: string,
  /**
   * Use CMake?
   */
  cmake: boolean,
  /**
   * Default name for the CMakeLists.txt files.
   */
  readonly CMAKELISTS_FILE: string,
  /**
   * Description of the app.
   */
  description: string,
  /**
   * Use editorconfig?
   */
  editorConfig: boolean,
  /**
   * Editorconfig file name.
   */
  readonly EDITOR_CONFIG: string,
  /**
   * Folder name for the app to scaffold.
   */
  folderName: string,
  /**
   * Absolute path to the app. Includes the app's folder.
   */
  fullPath: string,
  /**
   * Use Git?
   */
  git: boolean,
  /**
   * Default name for gitignore file.
   */
  readonly GITIGNORE_FILE: string,
  /**
   * The name of the main.cpp file.
   */
  mainFileName: string,
  /**
   * Default name for main file.
   */
  readonly MAIN_FILE_NAME: string,
  /**
   * Make a source folder?
   */
  srcFolder: boolean,
  /**
   * Source folder name. Where the code should live.
   */
  srcFolderName: string,
  /**
   * Default source folder name.
   */
  readonly SRC_FOLDER: string,
  /**
   * The C++ standard to use.
   */
  standard: string,
  /**
   * The C++ standards.
   */
  readonly STANDARDS: string[],
  /**
   * Default template folder relative to the build/src directories.
   */
  readonly TEMPLATE_FOLDER: string,
  /**
   * Use vcpkg?
   */
  vcpkg: boolean,
  /**
   * The name of the vcpkg.json file.
   */
  VCPKG_JSON: string,
  /**
   * The version of the app.
   */
  version: string,
  /**
   * The default version for the app
   */
  readonly VERSION: string
}

export const SCAPP_CONFIG: ScappConfig = {
  'addMain':         true,
  'appName':         '',
  'cmake':           true,
  'CMAKELISTS_FILE': 'CMakeLists.txt',
  'description':     '',
  'editorConfig':    true,
  'EDITOR_CONFIG':   '.editorconfig',
  'folderName':      '',
  'fullPath':        '',
  'git':             true,
  'GITIGNORE_FILE':  'not_a_gitignore_=)',
  'mainFileName':    '',
  'MAIN_FILE_NAME':  'main.cpp',
  'srcFolder':       true,
  'srcFolderName':   '',
  'SRC_FOLDER':      'src',
  'standard':        '',
  'STANDARDS':       ['C++98', 'C++11', 'C++14', 'C++17', 'C++20', 'C++23'],
  'TEMPLATE_FOLDER': '../template',
  'vcpkg':           true,
  'VCPKG_JSON':      'vcpkg.json',
  'version':         '',
  'VERSION':         '0.1.0'
};
