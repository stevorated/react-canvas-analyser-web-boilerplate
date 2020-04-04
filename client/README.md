# **react-canvas-analyser-electron-boilerplate** :stew:

## Description

An Example of a simple audio handler using **AudioContext API**. with **canvas** drawing capability. Can be used to show a **frequency** or/and **sinewave** display.

## Quick Start

-   git clone
-   yarn
-   yarn dev // run with hmr on the react side
    or
-   yarn start // run without hmr
    or
-   yarn build to build the app

## Notes

To use with electron just clone the app, yarn install, change paths and DESKTOP_PATH to a valid path in your pc and your done (just build or run with the script above)

The react side should work on every web based browser/platform
in order to separate the react side just use the views folder
(main folder and webpack.main.js in root folder ared only needed for the electron side of things, you don't need them)

to use with urls just insert them (component uses axios to access file)
I Build this for another project of mine, feel free to use it and modify it at will

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF `CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
