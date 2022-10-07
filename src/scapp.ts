#! /usr/bin/env node

// file system
import * as fs from 'fs';
// path utils
import path from 'path';
// to know where this file is
import { fileURLToPath } from 'url';
// for the exitCode
import process from 'process';
// for the git init command
import { execSync } from 'child_process';
// arguments
import { Command } from 'commander';
// own imports
import { SCAPP_CONFIG } from './config.js';
import Ask from './questions.js';
import cmake from './cmake.js';

const program = initCommander();
const debugMode = program.opts().debug as boolean;

/**
 * Copies the template folder to the user's desired directory.
 * @param templateFolderName The name of the template folder.
 * @param destination The destination folder. The one desired by the user.
 * @returns True if all went OK. False otherwise.
 */
function copyTemplateFolder(templateFolderName: string, destination: string): boolean {
  // get the full path to the template folder
  const templateFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), templateFolderName);
  // copy it to the user's desired directory
  try {
    fs.cpSync(templateFolder, destination, { recursive: true });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * @param fullPath The full path to the desired folder.
 * @returns True if the folder was created successfully. False otherwise.
 */
function createAppFolder(fullPath: string): boolean {
  try {
    if (!fs.existsSync(fullPath)) {
      // folder doesn't even exists, good!
      fs.mkdirSync(fullPath);
      if (debugMode) console.debug(`Full path to app directory: ${fullPath}`);
      return true;
    } else {
      // folder exists, check if it's empty
      if (fs.readdirSync(fullPath).length) {
        // folder's not empty
        console.error('Folder already exists and isn\'t emtpy! Aborting.');
        return false;
      }
      // folder is emtpy
      console.warn('Folder already exists, but it seems to be empty. Proceeding...');
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Initializes and configures Commander.
 * @returns A Command object ready to use.
 */
function initCommander(): Command {
  const command = new Command();
  command.name('scapp').description('C++ scaffolding app').version('1.0.0');
  command.option('--debug');
  command.parse();
  return command;
}

/**
 * Initializates a git repository in a given folder.
 * @param where The absolute path to the folder in which you want to init the git repo.
 */
function initGit(where: string) {
  try {
    const output = execSync('git init', { cwd: where, encoding: 'utf-8' });
    if (debugMode) console.debug(output);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Deletes a given file.
 * @param file The absolute path to the file to delete.
 */
function removeFile(file: string) {
  try {
    fs.rmSync(file);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Removes a given folder, even if it's not emtpy.
 * @param path The absolute path to the folder.
 */
function removeFolder(path: string) {
  try {
    fs.rmSync(path, { recursive: true, force: true });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Renames a given folder.
 * @param folder The absolute path to the folder to be renamed.
 * @param newName The new name for the folder.
 */
function renameFolder(folder: string, newName: string) {
  const finalFolder = path.join(folder, '../', newName);
  try {
    fs.renameSync(folder, finalFolder);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Driver code for the app.
 */
async function scapp() {
  // app name
  SCAPP_CONFIG.appName = await Ask.appName();
  // app folder name
  SCAPP_CONFIG.folderName = await Ask.folderName(SCAPP_CONFIG.appName);
  // src folder & it's name
  SCAPP_CONFIG.srcFolder = await Ask.sourceFolder();
  if ((SCAPP_CONFIG.srcFolder)) SCAPP_CONFIG.srcFolderName = await Ask.sourceFolderName(SCAPP_CONFIG.SRC_FOLDER);
  // git
  SCAPP_CONFIG.git = await Ask.git();
  // cmake
  SCAPP_CONFIG.cmake = await Ask.cmake();
  // vcpkg
  SCAPP_CONFIG.vcpkg = await Ask.vcpkg();
  // editorconfig
  SCAPP_CONFIG.editorConfig = await Ask.editorConfig();

  // try to create the folder app folder
  SCAPP_CONFIG.fullPath = path.join(process.cwd(), SCAPP_CONFIG.folderName);
  if (!createAppFolder(SCAPP_CONFIG.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // copy the contents of template folder to the app folder
  if (!copyTemplateFolder(SCAPP_CONFIG.TEMPLATE_FOLDER, SCAPP_CONFIG.fullPath)) {
    process.exitCode = 1;
    return;
  }

  // git
  if (SCAPP_CONFIG.git) {
    // git init command to jumpstart a git repo
    initGit(SCAPP_CONFIG.fullPath);
  } else {
    // remove .gitignore if no git used
    removeFile(path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.GITIGNORE_FILE));
  }

  // cmake
  if (SCAPP_CONFIG.cmake) {
    cmake(SCAPP_CONFIG);
  } else {
    // remove main CMakeLists.txt
    removeFile(path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.CMAKELISTS_FILE));
    // remove source folder's CMakeLists.txt
    if (SCAPP_CONFIG.srcFolder) removeFile(path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.srcFolderName, SCAPP_CONFIG.CMAKELISTS_FILE));
  }

  // source folder
  if (!SCAPP_CONFIG.srcFolder) {
    // remove the source folder if needed
    removeFolder(path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.SRC_FOLDER));
  } else if (SCAPP_CONFIG.srcFolderName !== SCAPP_CONFIG.SRC_FOLDER) {
    // rename source folder if needed
    renameFolder(path.join(SCAPP_CONFIG.fullPath, SCAPP_CONFIG.SRC_FOLDER), SCAPP_CONFIG.srcFolderName);
  }
}

scapp();
