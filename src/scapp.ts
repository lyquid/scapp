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

const program = new Command();
program.name('scapp').description('C++ scaffolding app').version('1.0.0');
program.option('--debug');
program.parse();
const debugMode = program.opts().debug;
const prompt = Prompt({ sigint: true });

/**
 * @returns The final app name.
 */
function AppName(): string {
  let name: string;
  do {
    name = prompt('Name of your C++ app: ') as string;
  } while (name === '');
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
 * Driver code for the app.
 */
function Scapp(): void {
  // template app folder
  const templateFolder = 'template';
  if (!CheckTemplateFolder(templateFolder)) {
    process.exitCode = 1;
    return;
  }
  // app name
  const appName = AppName();
  // app folder name
  const folderName = FolderName(appName);
  // try to create the folder
  const fullPath = path.join(process.cwd(), folderName);
  if (!CreateAppFolder(fullPath)) {
    process.exitCode = 1;
    return;
  }
}

Scapp();
