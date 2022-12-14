import inquirer from 'inquirer';

/**
 * Wrapper class for prompt questions.
 */
export default class Ask {

  /**
   * Asks if the new app should have a main file.
   * @returns True if the app will have a main file. False otherwise.
   */
  static async addMain(): Promise<boolean> {
    let addMain = true;
    await inquirer.prompt([{
      type:    'confirm',
      name:    'addMain',
      message: 'Add a main file:',
      default: true
    }])
    .then((answers) => {
      addMain = answers.addMain as boolean;
    })
    .catch((error) => {
      console.error(error);
    });
    return addMain;
  }

  /**
   * Ask users to input a name for their app.
   * Must begin with an alphanumeric char
   * and contain only alphanumeric, underscores and/or dashes.
   * @returns The final app name.
   */
  static async appName(): Promise<string> {
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
        if (!Ask.#isAlphaNumeric(input.charAt(0))) {
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
   * Asks if the new app should use CMake.
   * @returns True if the app will use CMake. False otherwise.
   */
  static async cmake(): Promise<boolean> {
    let useCmake = true;
    await inquirer.prompt([{
      type:    'confirm',
      name:    'cmake',
      message: 'Use CMake:',
      default: true
    }])
    .then((answers) => {
      useCmake = answers.cmake as boolean;
    })
    .catch((error) => {
      console.error(error);
    });
    return useCmake;
  }

  /**
   * Asks for a description for the app.
   * @returns The user input for description.
   */
  static async description(): Promise<string> {
    let description = '';
    await inquirer.prompt([{
      name:    'description',
      message: 'A description for your app:',
    }])
    .then((answers) => {
      description = answers.description as string;
    })
    .catch((error) => {
      console.error(error);
    });
    return description;
  }

  /**
   * Asks if the new app should use editorconfig.
   * @returns True if the app will use editorconfig. False otherwise.
   */
  static async editorConfig(): Promise<boolean> {
    let useEditorConfig = true;
    await inquirer.prompt([{
      type:    'confirm',
      name:    'editorConfig',
      message: 'Use editorconfig:',
      default: true
    }])
    .then((answers) => {
      useEditorConfig = answers.editorConfig as boolean;
    })
    .catch((error) => {
      console.error(error);
    });
    return useEditorConfig;
  }

  /**
   * @param appName The previously asked app's name.
   * @returns The final folder name.
   */
  static async folderName(appName: string): Promise<string> {
    let folderName = '';
    await inquirer.prompt([{
      name: 'folderName',
      message: 'Folder name for your C++ app:',
      default: appName,
      validate: (input: string) => {
        if (input !== '' && input !== null && this.#validFolderName(input)) {
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
   * Asks if the new app should use Git.
   * @returns True if the app will use Git. False otherwise.
   */
  static async git(): Promise<boolean> {
    let useGit = true;
    await inquirer.prompt([{
      type:    'confirm',
      name:    'git',
      message: 'Use Git:',
      default: true
    }])
    .then((answers) => {
      useGit = answers.git as boolean;
    })
    .catch((error) => {
      console.error(error);
    });
    return useGit;
  }

  /**
   * Asks for a name for the main file.
   * @param defaultName The default name for the main file.
   * @returns The desired name for the main file.
   */
  static async mainFileName(defaultName: string): Promise<string> {
    let mainFileName = '';
    await inquirer.prompt([{
      name:    'mainFileName',
      message: 'Name for the main file:',
      default: defaultName,
      validate: (input: string) => {
        if (input !== '' && input !== null && this.#validFolderName(input)) {
          return 'Invalid file name.';
        }
        return true;
      }
    }])
    .then((answers) => {
      mainFileName = answers.mainFileName as string;
    })
    .catch((error) => {
      console.error(error);
    });
    return mainFileName;
  }

  /**
   * Asks if the new app should have a source folder.
   * @returns True if the app will have a source folder. False otherwise.
   */
  static async sourceFolder(): Promise<boolean> {
    let useSrcFolder = true;
    await inquirer.prompt([{
      type:    'confirm',
      name:    'srcFolder',
      message: 'Create a source folder:',
      default: true
    }])
    .then((answers) => {
      useSrcFolder = answers.srcFolder as boolean;
    })
    .catch((error) => {
      console.error(error);
    });
    return useSrcFolder;
  }

  /**
   * Asks for a name for the source folder.
   * @param defaultName The default name for the source folder.
   * @returns The desired name for the source folder.
   */
  static async sourceFolderName(defaultName: string): Promise<string> {
    let srcFolderName = '';
    await inquirer.prompt([{
      name:    'srcFolderName',
      message: 'Name for the source folder:',
      default: defaultName,
      validate: (input: string) => {
        if (input !== '' && input !== null && this.#validFolderName(input)) {
          return 'Invalid folder name.';
        }
        return true;
      }
    }])
    .then((answers) => {
      srcFolderName = answers.srcFolderName as string;
    })
    .catch((error) => {
      console.error(error);
    });
    return srcFolderName;
  }

  /**
   * Asks for the C++ standard to use.
   * @standards An array of available standards.
   * @returns The standard to use.
   */
  static async standard(standards: string[]): Promise<string> {
    let standard = '';
    await inquirer.prompt([{
      type:    'list',
      name:    'standard',
      message: 'C++ standard:',
      choices: standards,
      default: 'C++17',
    }])
    .then((answers) => {
      switch (answers.standard as string) {
        case 'C++98':
          standard = '98';
          break;
        case 'C++11':
          standard = '11';
          break;
        case 'C++14':
          standard = '14';
          break;
        case 'C++17':
          standard = '17';
          break;
        case 'C++20':
          standard = '20';
          break;
      }
    })
    .catch((error) => {
      console.error(error);
    });
    return standard;
  }

  /**
   * Asks if the new app should use vcpkg.
   * @returns True if the app will use vcpkg. False otherwise.
   */
  static async vcpkg(): Promise<boolean> {
    let useVcpkg = true;
    await inquirer.prompt([{
      type:    'confirm',
      name:    'vcpkg',
      message: 'Use vcpkg:',
      default: true
    }])
    .then((answers) => {
      useVcpkg = answers.vcpkg as boolean;
    })
    .catch((error) => {
      console.error(error);
    });
    return useVcpkg;
  }

  /**
   * Asks for a version for the app.
   * @param defaultVersion The default version number.
   * @returns The version for the app.
   */
  static async version(defaultVersion: string): Promise<string> {
    let version = '';
    await inquirer.prompt([{
      name:    'version',
      message: 'App version:',
      default: defaultVersion
    }])
    .then((answers) => {
      version = answers.version as string;
    })
    .catch((error) => {
      console.error(error);
    });
    return version;
  }

  /**
   * Checks if a string is alphanumerical.
   * Inspired from [here](https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript).
   * @param str The string to check.
   * @returns True if the string is alphanumerical.
   */
  static #isAlphaNumeric(str: string): boolean {
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
   * Cheks if a given string is a valid folder name.
   * @param str The string to check.
   * @returns True if it's a **GOOD** folder name. False if it's **NOT** a valid folder name.
   */
   static #validFolderName(str: string): boolean {
    const regexp = /^[^\s^\x00-\x1f\\?*:"";<>|/.][^\x00-\x1f\\?*:"";<>|/]*[^\s^\x00-\x1f\\?*:"";<>|/.]+$/g;
    return !regexp.test(str);
  }
}
