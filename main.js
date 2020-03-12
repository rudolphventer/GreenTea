const { app, BrowserWindow, Menu } = require('electron')
const url=require('url')
const path=require('path')

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
  label: 'Text',
      submenu: [
        {
          label:'Increase Editor Text Size',
          click() { 
            win.webContents.executeJavaScript('editorTextSize("+")')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
          },
          accelerator: 'CmdOrCtrl+Shift+['
        },
        {
          label:'Decrease Editor Text Size',
          click() { 
            win.webContents.executeJavaScript('editorTextSize("-")')
            .then(result => console.log("success"))
            .catch(console.log("Error"))
          },
          accelerator: 'CmdOrCtrl+Shift+]'
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
          accelerator: 'CmdOrCtrl+T',
          enabled: false
      },
      { role: 'reload' },
        { role: 'forcereload' },
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
          label:'TEMP'
      }
  ]
}
)

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

console.log(template[4].submenu[1].click)
menu2 = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu2); 
  
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