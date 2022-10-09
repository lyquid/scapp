# scapp

Scaffold a C++ App

## What?

Create a scaffold for your C++ app in seconds, supporting [Git](https://git-scm.com/), [CMake](https://cmake.org/), [editorconfig](https://editorconfig.org/) and [vcpkg](https://vcpkg.io/en/index.html) and also different C++ standards.

## How?

Install the app like this: `npm i scapp -g`.

This is a CLI app that asks the user for information like app name, version, use editorconfig or not, etc. Then scaffolds a folder with all that input.

## Why?

If your are like me and enjoy starting new C++ projects to try new things, maybe you are tired of always setup the app before you can even code something.

That's the reason why I've created this tool: *laziness*.

## Features

My plan, for now, is to make the app compatible with the tools I use, which are: **CMake**, **editorconfig**, **Git**, and **vcpkg**.

I usually code with [VSCode](https://code.visualstudio.com/) editor with a bunch of C++ [extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack) that allow me to compile and run the app from the editor, so no support for MSVC or make, *yet*.

- [x] Adds a pretty complete `.gitignore` generated from [here](https://www.toptal.com/developers/gitignore?templates=windows,macos,linux,node,c++,visualstudiocode,emacs,vim,visualstudio,cmake,vcpkg,intellij+all).
- [x] `.editorconfig`.
- [x] Various `CMakeLists.txt` already configured.
- [x] A `vcpkg.json` also minimally configured.
- [x] Which C++ standard to use (ie: C++20 (ISO/IEC 14882:2020)).
- [ ] Compiler flags.
