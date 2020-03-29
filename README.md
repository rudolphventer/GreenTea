
<p align="center">
    <img src="icon.png" alt="GreenTea logo" width="100" height="100">
</p>

<h3 align="center">GreenTea</h3>

<p align="center">
  A simple, minimalist code editor written in Javascript, HTML and CSS using Electron and the wonderful Ace editor
  <br>
</p>

## Downloads

- [Windows 64 bit and 32 bit installer](http://www.mediafire.com/file/5e0712erxbpsmpo/GreenTea_Setup_1.0.0.exe/file)
- [Debian installer (.deb)](http://www.mediafire.com/file/az0l2pnc2d1lnvu/GreenTea_1.0.0_amd64.deb/file)
- [Appimage (for most Linux distros)](http://www.mediafire.com/file/uqxva1t9xfht6d8/GreenTea-1.0.0.AppImage/file)

## How to build GreenTea yourself

Ensure you have the latest version of Node and NPM installed
1. Clone the repo or download the zip file and extract it somewhere
2. Open a terminal there and type ```npm install``` or in Linux ```sudo npm install ```
3. Then run the appropriate command


```npm run start // starts GreenTea```


```npm run buildwindows // builds the installer .exe in the /dist folder```



```npm run buildlinux // builds .deb installer and portable .appimage in /dist folder, this will only work on Linux```
  

## Features and goals for next release

- Help file

- Show selected theme and lanugage and toggle "Open last file" in menu

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

- Check why only one instance of GreenTea can be open at once, second window does not have an editor for some reason

## Bugs: Linux

- Create new file names file C:/

- File associations broken

- Appimage icons broken

- .deb license, description and app store icon broken/unfinished
