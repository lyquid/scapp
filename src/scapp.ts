#! /usr/bin/env node

// file system
import * as fs from 'fs';
// path utils
import path from 'path';
// to know where this file is
import { fileURLToPath } from 'url';
// for the exitCode
import process from 'process';
// arguments
import { Command } from 'commander';
// configuration interface
import { ScappConfig } from './config.js';
// questions
import Ask from './questions.js';

const program = initCommander();
const debugMode = program.opts().debug;

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
  // default source folder name
  const SRC_FOLDER = 'src';
  // configuration object initialization
  const CONFIG: ScappConfig = {
    'appName':        '',
    'cmake':          true,
    'editorConfig':   true,
    'folderName':     '',
    'fullPath':       '',
    'git':            true,
    'srcFolder':      true,
    'srcFolderName':  SRC_FOLDER,
    'templateFolder': '../template',
    'vcpkg':          true
  };
  // app name
  CONFIG.appName = await Ask.appName();
  // app folder name
  CONFIG.folderName = await Ask.folderName(CONFIG.appName);
  // src folder & it's name
  CONFIG.srcFolder = await Ask.sourceFolder();
  if ((CONFIG.srcFolder)) CONFIG.srcFolderName = await Ask.sourceFolderName(SRC_FOLDER);
  // git
  CONFIG.git = await Ask.git();
  // cmake
  CONFIG.cmake = await Ask.cmake();
  // vcpkg
  CONFIG.vcpkg = await Ask.vcpkg();
  // editorconfig
  CONFIG.editorConfig = await Ask.editorConfig();
  // try to create the folder app folder
  CONFIG.fullPath = path.join(process.cwd(), CONFIG.folderName);
  if (!createAppFolder(CONFIG.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // copy the contents of template folder to the app folder
  if (!copyTemplateFolder(CONFIG.templateFolder, CONFIG.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // remove the source folder if needed
  if (!CONFIG.srcFolder) {
    removeFolder(path.join(CONFIG.fullPath, SRC_FOLDER));
  } else if (CONFIG.srcFolderName !== SRC_FOLDER) {
    // rename source folder if needed
    renameFolder(path.join(CONFIG.fullPath, SRC_FOLDER), CONFIG.srcFolderName);
  }
}

scapp();
