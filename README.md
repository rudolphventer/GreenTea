
<p align="center">
    <img src="resources/icon.png" alt="GreenTea logo" width="100" height="100">
</p>

<h3 align="center">GreenTea</h3>

<p align="center">
  A simple, minimalist code editor written in Javascript, HTML and CSS using Electron and the wonderful Ace editor
  <br>
</p>

## Downloads

Check [releases](https://github.com/rudolphventer/GreenTea/releases) for the newest installers availalbe in the following formats
- Windows 64 bit and 32 bit installer
- Debian installer (.deb)
- Appimage (for most Linux distros)

## How to build GreenTea yourself

Ensure you have the latest version of Node and NPM installed
1. Clone the repo or download the zip file and extract it somewhere
2. Open a terminal there and type ```npm install``` or in Linux ```sudo npm install ```
3. Then run the appropriate command


```npm run start // starts GreenTea```


```npm run buildwindows // builds the installer .exe in the /dist folder```



```npm run buildlinux // builds .deb installer and portable .appimage in /dist folder, this will only work on in a Linux environment due to electron-builder```
  

## Features and goals for next release

- Tab system

- Multiple instances


## Enhancements/Improvements

- Remember window position on launch

- Remember last working directory in file tree, not just folder of current file


## Planned Features

- Terminal emulator

- On-save commands

- Lanugage autodetect for more languages

- Tabs

- autodetect file extension based on language when saving

## Bugs: Windows

- Check why only one instance of GreenTea can be open at once, second window does not have an editor for some reason

- When opening a file that has been deleted without savign changes to your current file and you click "no" a notification appears telling  you that the file could not be found

## Bugs: Linux

- Create new file names file C:/

- File associations broken

- Appimage icons broken

- .deb license, description and app store icon broken/unfinished
