/**
 * Interface used to store configuration options for the app.
 */
export interface ScappConfig {
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
   * Default template folder relative to the build/src directories.
   */
  readonly TEMPLATE_FOLDER: string,
  /**
   * Use vcpkg?
   */
  vcpkg: boolean
}

export const SCAPP_CONFIG: ScappConfig = {
  'appName':         '',
  'cmake':           true,
  'CMAKELISTS_FILE': 'CMakeLists.txt',
  'editorConfig':    true,
  'EDITOR_CONFIG':   '.editorconfig',
  'folderName':      '',
  'fullPath':        '',
  'git':             true,
  'GITIGNORE_FILE':  '.gitignore',
  'srcFolder':       true,
  'srcFolderName':   '',
  'SRC_FOLDER':      'src',
  'TEMPLATE_FOLDER': '../template',
  'vcpkg':           true
};
