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
import Prompt from 'prompt-sync';

const program = InitCommander();
const prompt = Prompt({ sigint: true });
const debugMode = program.opts().debug;

/**
 * Ask users to input a name for their app.
 * Must begin with an alphanumeric char
 * and contain only alphanumeric, underscores and/or dashes.
 * @returns The final app name.
 */
function AppName(): string {
  // only letters, numbers, underscore and dash
  const regexp = /^[A-Za-z0-9_-]*$/;
  let name = '';
  let goodName = false;
  // do this until we get a good name
  while (!goodName) {
    name = prompt('Name of your C++ app: ') as string;
    // lets asume the name is good, for now...
    goodName = true;
    // if empty, ask again (and abort!)
    if (name === '') {
      console.log('App name is mandatory. If you don\'t have any name yet, press ctrl+c and come back later :P');
      goodName = false;
      continue;
    }
    // if doesn't match the regexp, ask again
    if (!name.match(regexp)) {
      console.log('App name can only contain alphanumeric characters, underscores and dashes.');
      goodName = false;
    }
    // if shorter than 3 chars, ask again
    if (name.length < 3) {
      console.log('App name must be 3 chars or more.');
      goodName = false;
    }
    // first char must be alphanumeric, ask again
    if (!IsAlphaNumeric(name.charAt(0))) {
      console.log('First char must be alphanumeric.');
      goodName = false;
    }
  }
  return name;
}

/**
 * @param templateFolder The name of the template folder.
 * @returns True if the folder exists. False otherwise.
 */
function CheckTemplateFolder(templateFolder: string): boolean {
  if (!fs.existsSync(templateFolder)) {
    console.error('Template folder is missing! Aborting.');
    return false;
  } else {
    if (debugMode) console.debug('Template folder exists.');
    return true;
  }
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
      // folder exists
      console.error('Folder already exists! Aborting.');
      return false;
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
function FolderName(appName: string): string {
  const input = prompt(`Folder name (default '${appName}'): `) as string;
  return input !== '' ? input : appName;
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
function Scapp(): void {
  // config object for convenience
  const config = {
    'appName':        '',
    'folderName':     '',
    'fullPath':       '',
    'templateFolder': 'template'
  };
  // template app folder
  if (!CheckTemplateFolder(config.templateFolder)) {
    process.exitCode = 1;
    return;
  }
  // app name
  config.appName = AppName();
  // app folder name
  config.folderName = FolderName(config.appName);
  // try to create the folder
  config.fullPath = path.join(process.cwd(), config.folderName);
  if (!CreateAppFolder(config.fullPath)) {
    process.exitCode = 1;
    return;
  }
}

Scapp();
