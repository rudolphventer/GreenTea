const { app, BrowserWindow, Menu } = require('electron')
const url=require('url')
const path=require('path')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    title: "GreenTea",
    backgroundColor: "#181818",
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "icon.png",
    frame: true
  })

  win.on('close', function(e){
    e.preventDefault();
    win.webContents.executeJavaScript('compareSaveStateUpToDate()')
    .then(result =>
      {
        console.log(result)
        if(!result && result !== undefined)
        {
          var choice = require('electron').dialog.showMessageBox(win,
            {
              type: 'question',
              buttons: ['Yes', 'No'],
              title: 'Confirm',
              message: 'You have unsaved changes, are you sure you want to quit?'
            });
          choice.then(function(res){
              // 0 for Yes
              if(res.response== 0){
                win.destroy()
              }
              // 1 for No
              if(res.response== 1){

              }
            }
          )
        }
        else
        {
          win.destroy()
        }
      })
    .catch(err => console.log("error",err))
    });

  // and load the index.html of the app.
  win.loadFile('index.html')

  win.loadURL(url.format({
    pathname:path.join(__dirname,'index.html'),
    protocol:'file:',
    slashes:true
  }))

  // Open the DevTools.
  //win.webContents.openDevTools()

  var menu = Menu.buildFromTemplate([
    {
        label: 'File',
            submenu: [
              {
                label:'Save',
                click() { 
                  win.webContents.executeJavaScript('saveFile()')
                  .then(result => console.log("success"))
                  .catch(console.log("Error"))
                },
                accelerator: 'CmdOrCtrl+S'
            },
            {
              label:'Save As',
              click() { 
                win.webContents.executeJavaScript('saveNewFile()')
                .then(result => console.log("success"))
                .catch(console.log("Error"))
              },
              accelerator: 'CmdOrCtrl+Shift+S'
            },
            {
              label:'New File',
              click() { 
                win.webContents.executeJavaScript('createNewFile()')
                .then(result => console.log("success"))
                .catch(console.log("Error"))
              },
              accelerator: 'CmdOrCtrl+Shift+N'
            },
            {
              label:'Open File',
              click() { 
                win.webContents.executeJavaScript('openNewFileUI()')
                .then(result => console.log("success"))
                .catch(console.log("Error"))
              },
              accelerator: 'CmdOrCtrl+Shift+O'
            },
            {
              label:'Test',
              click() { 
                win.webContents.executeJavaScript('compareSaveStateUpToDate()')
                .then(result => console.log("success"))
                .catch(console.log("Error"))
              }
            },
            {
                label:'Exit', 
                click() { 
                    app.quit() 
                } 
            }
        ]
    },
    {
      label: 'Edit',
          submenu: [
            {
              label:'TEMP'
          }
      ]
    },
    {
      label: 'View',
          submenu: [
            {
              label:'Toggle Terminal',
              click() { 
                win.webContents.executeJavaScript('toggleTerminal()')
              },
              accelerator: 'CmdOrCtrl+T'
          }
      ]
    },
    {
      label: 'Language',
          submenu: [
            {
              label:'TEMP'
          }
      ]
    },
    {
      label: 'Theme',
          submenu: [
            {
              label:'TEMP'
          }
      ]
    },
    {
      label: 'Help',
          submenu: [
            {
              label:'TEMP'
          }
      ]
    },
  ])
Menu.setApplicationMenu(menu); 
  
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
