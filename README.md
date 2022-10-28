[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6638/badge)](https://bestpractices.coreinfrastructure.org/projects/6638)
# scapp

Scaffold a C++ App

## What?

Create a scaffold for your C++ app in seconds, supporting [Git](https://git-scm.com/), [CMake](https://cmake.org/), [editorconfig](https://editorconfig.org/) and [vcpkg](https://vcpkg.io/en/index.html) and also different C++ standards.

## How?

Install the app like this: `npm install -g scapp`. This will install the app globally, so you can use it from any directory.

Run the app by typing `scapp` on any command prompt.

This is a CLI app that asks the user for information like app name, version, use editorconfig or not, etc. Then scaffolds a folder with all that input.

## Why?

If your are like me and enjoy starting new C++ projects to try new things, maybe you are tired of manually configure the outrageous quantity of compiler and linker options just to use a simple library. And in Windows it gets worse, much worse. 

I wish that someday, C++ coders will enjoy an ecosystem similar to Node.js for JavaScript.

For now, use this if you please. It's mean to configure and scaffold a modern C++ app. You only need to add the dependencies on the `vcpkg.json` and in the corresponding `CMakeLists.txt` (more info inside those files, **read them!**).

That's the reason why I've created this tool: *laziness*.

## Features

My plan, for now, is to make the app compatible with the tools I use, which are: **CMake**, **editorconfig**, **Git**, and **vcpkg**.

I usually code with [VSCode](https://code.visualstudio.com/) editor with a bunch of C++ [extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack) that allow me to compile and run the app from the editor, so no support for MSVC or make, *yet*.

- [x] Adds a pretty complete `.gitignore` generated from [here](https://www.toptal.com/developers/gitignore?templates=windows,macos,linux,node,c++,visualstudiocode,emacs,vim,visualstudio,cmake,vcpkg,intellij+all).
- [x] `.editorconfig`.
- [x] Various `CMakeLists.txt` already configured.
- [x] A `vcpkg.json` also configured.
- [x] Which C++ standard to use (ie: C++20 (ISO/IEC 14882:2020)).
- [ ] Compiler flags.
