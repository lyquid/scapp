#! /usr/bin/env node

// file system
import * as fs from 'fs';
// path utils
import path from 'path';
// for the exitCode
import process from 'process';
// arguments
import { Command } from 'commander';
// CLI questions
import inquirer from 'inquirer';

const program = InitCommander();
const debugMode = program.opts().debug;

/**
 * Ask users to input a name for their app.
 * Must begin with an alphanumeric char
 * and contain only alphanumeric, underscores and/or dashes.
 * @returns The final app name.
 */
async function AppName(): Promise<string> {
  // only letters, numbers, underscore and dash
  const regexp = /^[A-Za-z0-9_-]*$/;
  let appName = '';
  await inquirer.prompt([{
    name: 'appName',
    message: 'Name of your C++ app:',
    validate: (input: string) => {
      if (input === '' || input === null) {
        return 'App name is mandatory. If you don\'t have any name yet, press ctrl+c and come back later :P';
      }
      if (!input.match(regexp)) {
        return 'App name can only contain alphanumeric characters, underscores and dashes.';
      }
      if (input.length < 3) {
        return 'App name must be 3 chars or more.';
      }
      if (!IsAlphaNumeric(input.charAt(0))) {
        return 'First char must be alphanumeric.';
      }
      return true;
    }
  }])
  .then((answers) => {
    appName = answers.appName as string;
  })
  .catch((error) => {
    console.error(error);
  });
  return appName;
}

/**
 * @param templateFolder The name of the template folder.
 * @returns True if the folder exists. False otherwise.
 */
// function CheckTemplateFolder(templateFolder: string): boolean {
//   if (!fs.existsSync(templateFolder)) {
//     console.error('Template folder is missing! Aborting.');
//     return false;
//   } else {
//     if (debugMode) console.debug('Template folder exists.');
//     return true;
//   }
// }

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
 * @param appName The name of the app.
 * @returns The final folder name.
 */
async function FolderName(appName: string): Promise<string> {
  let folderName = '';
  const regexp = /^[^\s^\x00-\x1f\\?*:"";<>|/.][^\x00-\x1f\\?*:"";<>|/]*[^\s^\x00-\x1f\\?*:"";<>|/.]+$/g;
  await inquirer.prompt([{
    name: 'folderName',
    message: 'Folder name for your C++ app: ',
    default: appName,
    validate: (input: string) => {
      if (input !== '' && input !== null && !input.match(regexp)) {
        return 'Invalid folder name.';
      }
      return true;
    }
  }])
  .then((answers) => {
    folderName = answers.folderName as string;
  })
  .catch((error) => {
    console.error(error);
  });
  return folderName !== '' ? folderName : appName;
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
 * Checks if a string is alphanumerical.
 * Inspired from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
 * @param str The string to check.
 * @returns True if the string is alphanumerical.
 */
function IsAlphaNumeric(str: string): boolean {
  let code: number;
  for (let i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) &&  // numeric (0-9)
        !(code > 64 && code < 91) &&  // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

/**
 * Driver code for the app.
 */
async function Scapp() {
  // config object for convenience
  const config = {
    'appName':        '',
    'folderName':     '',
    'fullPath':       '',
    'templateFolder': 'template'
  };
  // template app folder ** NOT CURRENTLY IN USE **
  // if (!CheckTemplateFolder(config.templateFolder)) {
  //   process.exitCode = 1;
  //   return;
  // }
  // app name
  config.appName = await AppName();
  // app folder name
  config.folderName = await FolderName(config.appName);
  // try to create the folder
  config.fullPath = path.join(process.cwd(), config.folderName);
  if (!CreateAppFolder(config.fullPath)) {
    process.exitCode = 1;
    return;
  }
}

Scapp();
