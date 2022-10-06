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
   * Use editorconfig?
   */
  editorConfig: boolean,
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
   * Make a source folder?
   */
  srcFolder: boolean,
  /**
   * Source folder name. Where the code should live.
   */
  srcFolderName: string,
  /**
   * Template folder name.
   */
  templateFolder: string,
  /**
   * Use vcpkg?
   */
  vcpkg: boolean
}
