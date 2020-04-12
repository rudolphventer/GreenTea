const { app, BrowserWindow, Menu } = require('electron')
const url=require('url')
const path=require('path')
const { ipcMain } = require('electron')
const fs = require('fs');
const PATH = require('path');
//file tree things
const dirTree = require("directory-tree");
//const tree = dirTree("C:\\Users\\Rudolph\\Desktop");
//console.log(tree)

const themelist = [
"clouds",
"crimson_editor",
"dawn",
"dreamweaver",
"eclipse",
"github",
"iplastic",
"solarized_light",
"textmate",
"tomorrow",
"xcode",
"kuroir",
"katzenmilch",
"sqlserver",           
"ambiance",   
"chaos",          
"clouds_midnight",  
"cobalt",     
"gruvbox",    
"gob",        
"idle_fingers",            
"kr_theme",   
"merbivore",  
"merbivore_soft",          
"mono_industrial",         
"monokai",    
"pastel_on_dark",          
"solarized_dark",          
"terminal",   
"tomorrow_night",          
"tomorrow_night_blue",     
"tomorrow_night_bright",   
"tomorrow_night_eighties", 
"twilight",   
"vibrant_ink",
]

const modelist = [
"abap",
"abc",
"actionscript",
"ada",
"apache_conf",
"apex",
"applescript",
"aql",
"asciidoc",
"asl",
"assembly_x86",
"autohotkey",
"batchfile",
"bro",
"c9search",
"cirru",
"clojure",
"cobol",
"coffee",
"coldfusion",
"crystal",
"csharp",
"csound_document",
"csound_orchestra",
"csound_score",
"csp",
"css",
"curly",
"c_cpp",
"d",
"dart",
"diff",
"django",
"dockerfile",
"dot",
"drools",
"edifact",
"eiffel",
"elixir",
"elm",
"erlang",
"forth",
"fortran",
"fsharp",
"fsl",
"ftl",
"gcode",
"gherkin",
"gitignore",
"glsl",
"gobstones",
"golang",
"graphqlschema",
"groovy",
"haml",
"handlebars",
"haskell",
"haskell_cabal",
"haxe",
"on",
"html",
"html_elixir",
"html_ruby",
"ini",
"io",
"jack",
"jade",
"java",
"javascript",
"modeon",
"modeon5",
"modeoniq",
"modep",
"modesm",
"modex",
"julia",
"kotlin",
"latex",
"less",
"liquid",
"lisp",
"livescript",
"logiql",
"logtalk",
"lsl",
"lua",
"luapage",
"lucene",
"makefile",
"markdown",
"mask",
"matlab",
"maze",
"mel",
"mixal",
"mushcode",
"mysql",
"nginx",
"nim",
"nix",
"nsis",
"nunjucks",
"objectivec",
"ocaml",
"pascal",
"perl",
"perl6",
"pgsql",
"php",
"php_laravel_blade",
"pig",
"plain_text",
"powershell",
"praat",
"prolog",
"properties",
"protobuf",
"puppet",
"python",
"r",
"razor",
"rdoc",
"red",
"redshift",
"rhtml",
"rst",
"ruby",
"rust",
"sass",
"scad",
"scala",
"scheme",
"scss",
"sh",
"slim",
"smarty",
"snippets",
"soy_template",
"space",
"sparql",
"sql",
"sqlserver",
"stylus",
"svg",
"swift",
"tcl",
"terraform",
"tex",
"text",
"textile",
"toml",
"tsx",
"turtle",
"twig",
"typescript",
"vala",
"vbscript",
"velocity",
"verilog",
"vhdl",
"visualforce",
"wollok",
"xml",
"xquery",
"yaml",
"zeek"
]

var recentfiles = []

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    title: "GreenTea",
    backgroundColor: "#181818",
    webPreferences: {
      nodeIntegration: true
    },
    icon: "resources/icon.ico",
    frame: true
  })
  win.maximize()

  
// read the file and send data to the render process when GreenTea is opened by clicking an associated file
ipcMain.on('get-file-data', function(event) {
  var data = null;
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1];
    data = openFilePath;
  }
  console.log(data)
  event.returnValue = data;
});
//populates "recent files" menu under Files menu item
ipcMain.on('recent-files', (event, arg) => {
  recentfiles = arg;
  template[0].submenu[2].submenu = []
  if(recentfiles != null)
  recentfiles.map( filepath =>
    {
      //filepath = filepath.replace("\\","\\\\")
      var testOne = String.raw `${filepath}`
      var testTwo = filepath.replace(/\\/g, "\\\\");
      template[0].submenu[2].submenu.push(
        {
          label:filepath,
          click() { 
            //here is the error, check render ocnsole, apparently all the "/" get removed from path for some reason
            console.log(filepath)
            console.log(testTwo)
            win.webContents.executeJavaScript('openFile("'+ testTwo +'")')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
          }
        })
    })
  

    menu2 = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu2); 
})
  
// Shows dialog before losing changes, notifies user of unsaved changes
ipcMain.handle('confirm-losing-changes', async (event, someArgument) => {
  return showConfirmLosingChangesDialog()
})

ipcMain.handle('open-folder', async (event, dir) => {
  //This bit replaces the default "type" = "directory" with "type" = "folder" 
  return  dirTree(dir, {extensions:/$/}, null, (item, PATH, stats) => {
    item.type = "folder"//Tree.FOLDER
});
})

//Checks if all changes to the file have been saved, returns a promise that resolves to true or false
function showConfirmLosingChangesDialog()
{
  return win.webContents.executeJavaScript('compareSaveStateUpToDate()')
  .then(result =>
    {
      if(!result && result !== undefined)
      {
        var choice = require('electron').dialog.showMessageBox(win,
          {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'You have unsaved changes, are you sure you want to continue?'
          });

         return choice
         .then(function(res){
            // 0 for Yes
            if(res.response== 0){
              return true;
            }
            // 1 for No
            if(res.response== 1){
              return false;
            }
          }
        )
        .catch(err => console.log(err))
      }
      else
      {
        return true;
      }
      
    })
  .catch(err => console.log("error",err))
}

//Calls dialog before closing if unsaved changes are detected
win.on('close', function(e){
  e.preventDefault();
  showConfirmLosingChangesDialog()
  .then( res =>
  {
    if(res)
    win.destroy();
  }).catch(err => console.log(err))
  });

// load the index.html of the app.
win.loadFile('index.html')

win.loadURL(url.format({
  pathname:path.join(__dirname,'index.html'),
  protocol:'file:',
  slashes:true
}))

// Open the DevTools.
//win.webContents.openDevTools()

//Creates template for menu items, this is done dynamically to allow updating of menu items
var template = [];
template.push(
  {
    label: 'File',
        submenu: [
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
            label:'Recent Files',
            submenu: []
          },
          {
            label:'Open Last File',
            click() { 
              win.webContents.executeJavaScript('openLastFile()')
              .then(result => console.log("success"))
              .catch(console.log("Error"))
            }
          },
          {
            label:'Open Folder',
            click() { 
              win.webContents.executeJavaScript('openFolder()')
              .then(result => console.log("success"))
              .catch(console.log("Error"))
            }
          },
          { type: 'separator' },
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
        { type: 'separator' },
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
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
  ]
},
{
  label: 'View',
      submenu: [
        /*{
          label:'Toggle Terminal',
          click() { 
            win.webContents.executeJavaScript('toggleTerminal()')
          },
          accelerator: 'CmdOrCtrl+T',
          hidden: true
      },*/
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
  ]
},
{
  label: 'Settings',
      submenu: [
        {
          label:'Increase Editor Text Size',
          click() { 
            win.webContents.executeJavaScript('editorTextSize("+")')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
          },
          accelerator: 'CmdOrCtrl+Shift+]'
        },
        {
          label:'Decrease Editor Text Size',
          click() { 
            win.webContents.executeJavaScript('editorTextSize("-")')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
          },
          accelerator: 'CmdOrCtrl+Shift+['
        },
        { type: 'separator' },
        { label: "Open Last File On Start",  
        id: 'open-last-toggle',
        enabled: true,
        click() {
          win.webContents.executeJavaScript('toggleOpenLast()')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
        } 
        },
        { label: "Toggle File Tree View",  
        enabled: true,
        accelerator: 'CmdOrCtrl+Shift+T',
        click() {
          win.webContents.executeJavaScript('toggleFileTree()')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
        } 
        },
  ]
},
{
  label: 'Language',
      submenu: [
  ]
},
{
  label: 'Theme',
      submenu: []
},
{
  label: 'Help',
      submenu: [
        {
          label:'Help File',
          click()
          {
            require("openurl").open("https://github.com/rudolphventer/GreenTea/blob/master/HelpFile.md")
          }
      }
  ]
}
)
  //Pushes list of themes to Themes menu
  themelist.map( theme =>
  {
    template[5].submenu.push(
      {
        label:theme,
        click() { 
          console.log(theme)
          var newTheme = theme
          win.webContents.executeJavaScript('setTheme("'+newTheme+'")')
          .then(result => console.log("success"))
          .catch(console.log("Error"))
        }
      }
  )
  })
  //Pushes list of modes to Language menu
  modelist.map( mode =>
    {
      template[4].submenu.push(
        {
          label:mode,
          click() { 
            console.log(mode)
            var newMode = mode
            win.webContents.executeJavaScript('setMode("'+newMode+'")')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
          }
        }
    )
    })
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

//////////////////////////Useful snippets


////// Render to main and vice versa communication

  //The main process part of talking to the renderer
  /*
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.reply('asynchronous-reply', 'pong')
  })

  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
  })*/

