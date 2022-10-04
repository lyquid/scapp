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

const program = InitCommander();
const debugMode = program.opts().debug;

/**
 * Copies the template folder to the user's desired directory.
 * @param templateFolderName The name of the template folder.
 * @param destination The destination folder. The one desired by the user.
 * @returns True if all went OK. False otherwise.
 */
function CopyTemplateFolder(templateFolderName: string, destination: string): boolean {
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
function CreateAppFolder(fullPath: string): boolean {
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
function InitCommander(): Command {
  const command = new Command();
  command.name('scapp').description('C++ scaffolding app').version('1.0.0');
  command.option('--debug');
  command.parse();
  return command;
}

/**
 * Driver code for the app.
 */
async function Scapp() {
  // config object for convenience
  const config = {
    'appName':        '',
    'editorConfig':   true,
    'folderName':     '',
    'fullPath':       '',
    'templateFolder': '../template'
  };
  // app name
  config.appName = await Ask.AppName();
  // app folder name
  config.folderName = await Ask.FolderName(config.appName);
  // editorconfig
  config.editorConfig = await Ask.EditorConfig();
  // try to create the folder app folder
  config.fullPath = path.join(process.cwd(), config.folderName);
  if (!CreateAppFolder(config.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // copy the contents of template folder to the app folder
  if (!CopyTemplateFolder(config.templateFolder, config.fullPath)) {
    process.exitCode = 1;
    return;
  }
  // transform template to user input
}

Scapp();
