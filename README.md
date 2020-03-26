
<p align="center">
    <img src="icon.png" alt="GreenTea logo" width="100" height="100">
</p>

<h3 align="center">GreenTea</h3>

<p align="center">
  A simple, minimalist code editor written in Javascript, HTML and CSS using Electron and the wonderful Ace editor
  <br>
</p>

## How to build GreenTea yourself

Ensure you have the latest version of Node and NPM installed
1. Clone the repo or download the zip file and extract it somewhere
2. Open a terminal there and type ```npm install``` or in Linux ```sudo npm install ```
3. Then run the appropriate command
<br>
```npm run start // starts GreenTea```
<br>
```npm run buildwindows // builds the installer .exe in the /dist folder```
<br>
```npm run buildlinux // builds .deb installer and portable .appimage in /dist folder```
  

## Features and goals for next release

- Check exit-save file on "new file"

- Help file

- Control-r disable

- Show selected theme and lanugage in menu

- Package better for Github, set build scripts up properly to produce presentable installer and final product

- Toggle "Open last file"

- Clean up dependencies, Bootstrap, Popperjs etc. no longer needed

## Enhancements/Improvements

- Improve popup notification aesthetics

- Remember window position on launch

## Planned Features

- Terminal emulator

- Side panel file browser

- On-save commands

- Lanugage autodetect for more languages

- Tabs

- Native context menu, right click menu

- Font selector

- autodetect file extension based on language when saving

## Bugs: Windows

- When opening the text editor, if the most recent file is not found then the popup just says "could not find contents of", probably a problem in the getContents() function

- Check why only one instance of GreenTea can be open at once, second window does not have an editor for some reason

- Check 49 line limit

## Bugs: Linux

- Create new file names file C:/

- File associations broken

- Appimage icons broken

- .deb license, description and app store icon broken/unfinished
