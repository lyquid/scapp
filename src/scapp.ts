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
 * Driver code for the app.
 */
async function scapp() {
  // config object for convenience
  const config = {
    'appName':        '',
    'cmake':          true,
    'editorConfig':   true,
    'folderName':     '',
    'fullPath':       '',
    'git':            true,
    'srcFolder':      true,
    'srcFolderName':  'src',
    'templateFolder': '../template',
    'vcpkg':          true
  };
  // app name
  config.appName = await Ask.appName();
  // app folder name
  config.folderName = await Ask.folderName(config.appName);
  // src folder & it's name
  config.srcFolder = await Ask.sourceFolder();
  if ((config.srcFolder)) config.srcFolderName = await Ask.sourceFolderName();
  // git
  config.git = await Ask.git();
  // cmake
  config.cmake = await Ask.cmake();
  // vcpkg
  config.vcpkg = await Ask.vcpkg();
  // editorconfig
  config.editorConfig = await Ask.editorConfig();
  // try to create the folder app folder
  config.fullPath = path.join(process.cwd(), config.folderName);
  if (!createAppFolder(config.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // copy the contents of template folder to the app folder
  if (!copyTemplateFolder(config.templateFolder, config.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // remove the source folder if needed
  if (!config.srcFolder) {
    removeFolder(path.join(config.fullPath, config.srcFolderName));
  }
}

scapp();
