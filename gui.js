const { ipcRenderer } = require('electron')
const fs = require('fs');

//Var to assign Ace Editor to
var editor;
//Initial setup of currentfile
var currentFile = undefined;
//lanuage is set as the file extension without the ".", this is used by the detectlanugage fgunction to determine which mode to set the editor to
var language = "txt";
//creates user settings object
var userSettings;
//Creating notification variable
var currentNotification;
//Create default settings in case a user has not set their own up yet
var defaultSettings =
{
  "openLast": true,
  "recentFiles": [],
  "terminalVisible": false,
  "theme": "monokai",
  "editorTextSize": 11,
  "fileTreeVisible": true,
  "workingDirectory": null
}



//Basic code to run each time GreenTea is run, "initialization" processes
function start()
{
  //Get user settings object from localstorage
  readUserSettings();
  //Initial setup for the editor component
  initEditor();
  //Creates right click context menu on main
  createContextMenu(); 
  //Shows a little notification to let users know the program is ready to use
  showNotification("Drag a file here to start editing")
  //Until terminal is implemented//
  document.getElementById("terminal").style.display = "none";
  //Here we listen for files being opened in the program, so files that are associated with Greentea aka uses GreenTea as the "default" program to open them or when you right click and click "Open with"
  var data = ipcRenderer.sendSync('get-file-data');
  //Send recent files from userSettings.recentFiles to the main thread to construct the recent files menu
  ipcRenderer.send('recent-files', userSettings.recentFiles)
  //Checking if the program was opened via a file or as a new instance
  if (data !=  null && data !="." && fs.existsSync(data)) {
    openFile(data)
  } else {
    if(userSettings.openLast)
    {
    openLastFile()
    }
  }
  //check if terminal or filetree should be visible
  if(userSettings.hasOwnProperty("fileTreeVisible"))
  {
    if(!userSettings.fileTreeVisible)
    {
      document.getElementById("sidebar").style.display = "none";
    }
  }
}

function readUserSettings()
{
  //Attempt ot get user settings, if the object does not exist or there is some error, create a new settings object with default values
  try
  {
    userSettings = JSON.parse(readFromLocalStorage("userSettings"))
    if(userSettings == null || userSettings == undefined)
    {
      userSettings = defaultSettings
      storeUserSettings();
    }
  }
  catch
  {
    userSettings = defaultSettings
    storeUserSettings();
  }
  
}

function initEditor()
{
  //Assign Ace Editor to the variable created in ~line 5
  editor = ace.edit("editor");
  //Get theme from , userSettings.theme then set it, if no theme is set default to monokai
  if(userSettings.theme != null)
  {
    setTheme(userSettings.theme)
  }
  else
  {
    editor.setTheme("ace/theme/monokai");
  }
  //Let us know what theme is selected
  console.log("Theme: ",userSettings.theme)

  //Set default highlighting and remove print margin (because it's not 1990 anymore)
  editor.session.setMode("ace/mode/text");
  editor.setShowPrintMargin(false);

  //Get text size from userSettings.editorTextSize or default to 11pt
  if(userSettings.hasOwnProperty("editorTextSize") && userSettings.editorTextSize != undefined)
  {
    editorTextSize(userSettings.editorTextSize)
  }
  else
  {
    editor.setOptions({
      fontSize: "11pt"
    });
  }
}

function createContextMenu()
{
  const { remote } = require('electron')
    const { Menu, MenuItem } = remote
    
    const menu = new Menu()
    //menu.append(new MenuItem({ role: "copy", click() { console.log('item 1 clicked') } }))
    menu.append(new MenuItem({ role: "paste"}))
    menu.append(new MenuItem({ role: "copy"}))
    menu.append(new MenuItem({ role: "cut"}))
    menu.append(new MenuItem({ role: "undo"}))
    menu.append(new MenuItem({ role: "redo"}))
    menu.append(new MenuItem({ role: "delete"}))
    menu.append(new MenuItem({ role: "selectall"}))

    //menu.append(new MenuItem({ type: 'separator' }))
    //menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
    
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      menu.popup({ window: remote.getCurrentWindow() })
    }, false)
}

//Code to change settings/modify state of the editor
function toggleOpenLast()
{
  //Toggles setting to open last file
  if(userSettings.hasOwnProperty("openLast"))
  {
      if(userSettings.openLast)
    {
      userSettings.openLast = false;
      showNotification("Open last file disabled")
    }
    else
    {
      userSettings.openLast = true;
      showNotification("Open last file enabled")
    }
  }
  else
  {
    userSettings.openLast = true
  }
  storeUserSettings()
}

function toggleFileTree()
{
  //Toggles setting to show file tree
  if(userSettings.hasOwnProperty("fileTreeVisible"))
  {
      if(userSettings.fileTreeVisible)
    {
      userSettings.fileTreeVisible = false;
      document.getElementById("sidebar").style.display = "none";
    }
    else
    {
      userSettings.fileTreeVisible = true;
      document.getElementById("sidebar").style.display = "initial";
    }
  }
  else
  {
    userSettings.fileTreeVisible = true
  }
  storeUserSettings()
}

function toggleTerminal()
{
  //Toggles terminal visible, purely with css values
  if(userSettings.terminalVisible)
  {
    document.getElementById("terminal").style.display = "none";
    userSettings.terminalVisible = false;
  }
  else
  {
    document.getElementById("terminal").style.display = "initial";
    userSettings.terminalVisible = true;
  }
  storeUserSettings();
}

function setTheme(theme)
{
  //Set theme on editor then save current theme in usersettings
  editor.setTheme("ace/theme/"+theme);
  userSettings.theme = theme;
  storeUserSettings();
}

function setMode(mode)
{
  //Sets highlight language mode in editor and updates state to "refresh" the user's view
  editor.session.setMode("ace/mode/"+mode);
  updateState();
}

function editorTextSize(sign)
{
  var size = parseInt(userSettings.editorTextSize); 
  //If argument is +, increase size by 2 then save to userSettings.editorTextSize, the same with -, decreases size and saves to userSettings.editorTextSize
  if(sign == "+")
  {
    size += 2;
    showNotification(size+"pt")
    editor.setOptions({
      fontSize: size+"pt"
    });
  }
  else
  if(sign == "-")
  {
    size = size-2;
    showNotification(size+"pt")
    if(size > 3)
    {
      editor.setOptions({
        fontSize: size+"pt"
      });
    }
  }
  //If a number is given instead of a + or - then text is set to that size and saved
  else
  if(sign > 0)
  {
    showNotification(size+"pt")
    if(size > 3)
    {
      editor.setOptions({
        fontSize: size+"pt"
      });
    }
  }
  else
  {
    showNotification("Invalid size")
  }

  userSettings.editorTextSize = size;
  storeUserSettings();
}

//Code for interacting with localstorage
function saveToLocalStorage(name, value)
{
  //Simply saves arg 2 as the value for arg 1 in localstorage
  try{
    localStorage.setItem(name, value);
  }
  catch (err)
  {
    console.log(err);
  }
}

function readFromLocalStorage(name)
{
  //Attempts to read variable with name "name" from localstorage, returns null if it cannot
  try
  {
  return localStorage.getItem(name);
  }
  catch (err)
  {
    console.log(err);
    return null;
  }
}

function storeUserSettings()
{
  saveToLocalStorage("userSettings", JSON.stringify(userSettings))
}

//Code to interact with editor api, things we can tell the editor to do
function openLastFile()
{
  if(fs.existsSync(userSettings.recentFiles[userSettings.recentFiles.length-1]))
  {
      //check if the recent file value is null/invalid
      if(userSettings.recentFiles != null && userSettings.recentFiles.length > 0)
      {
        //Get most recent file from usersettings.recentfiles
        if(userSettings.recentFiles != null)
        openFile(userSettings.recentFiles[userSettings.recentFiles.length-1])
      }
      else
      {
        console.log("create new file")
      }
  }
  else
  {
    showNotification("Most recent file could not be found")
  }
}

function openFile(dir)
{
  ipcRenderer.invoke('confirm-losing-changes').then((result) => {
    if(result && fs.existsSync(dir))
    {
      //Sets currentfile to argument 1 "dir" then calls getcontents() on it
    try
    {
      currentFile = dir
      getContents(dir)
      .then(result => {
        //sets value of editor to data recieved from getContents(), arg 2 specifies that cursor moves to position 1
        editor.setValue(result, 1)
        //Shows notification indicating that file has been opened, then gets file extension of file
        showNotification(currentFile);
        language = currentFile.split('.').pop();
        //autodetects file language for syntax highlighting based on file extension
        detectLanguage();
        //updates state to refresh user's view
        updateState();
        //adds newly opneed file to recent file list
        addToRecentFiles(dir)
        //updating the Folder tree with the new directory
        console.log("getting dir", dir)
        getFolder(dir.substr(0, dir.lastIndexOf('\\')))
        console.log("Succesfully opened:",dir)
      }).catch(err => {console.log(err)})
    }
    catch (err)
    {
      //In case opening te file failed for some reason
      console.log(err)
      showNotification("Failed to load file")
    }
    }
    else
    {
      if(!fs.existsSync(dir))
      {
        showNotification("Failed to load file")
      }
      
    }
  
  
})
}

function getContents(dir)
{
  //Returns text value of opened file
  if(fs.existsSync(dir))
    return fetch(dir)
            .then(response => 
              {return response.text()})
            .catch( error => 
              {
                console.log(error);
                showNotification("Could not get contents of file ", dir)
              })
}

function updateState()
{
  //If there is a currently opened file get the file name and update document title
  if(currentFile != undefined)
  {
    var mode = editor.session.$modeId;
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    document.title = "GreenTea - "+currentFile + " - " + mode;
  }
  else
  {
    //Else set document to "New File", only in ui
    var mode = editor.session.$modeId;
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    document.title = "GreenTea - "+"New File" + " - " + mode;
  }
}

function saveFile()
{
  //If you aren't working on an existing file the ncreate a new one and call saveNewFile()
  if(currentFile === undefined)
  {
    saveNewFile();
  }
  else
  {
    //If you are working on an existing file try to write the current text in the editor to the current file
    try { fs.writeFileSync(currentFile, editor.getValue(), 'utf-8'); 
    console.log("File Saved!")}
    catch(e) { alert('Failed to save the file !'); }
    showNotification("Saved!")
  }

}

function saveNewFile()
{
  const {remote} = require('electron'),
  dialog = remote.dialog,
  WIN = remote.getCurrentWindow();
  //Sets options for the savefile dialog
  let options = {
  title: "Save new file - GreenTea",
  buttonLabel : "Save",
  filters :[{name: 'All Files', extensions: ['*']}],
  showOverwriteConfirmation : true
  }

  //Synchronous, shows dialog then gets the user's selected file path
  let filename = dialog.showSaveDialog(WIN, options)
  filename.then(result =>{
  console.log(result)
  if(!result.canceled)
  {
    try
    {
      //Sets current file to the new path, then saves to create the file, we then open the file once again to ensure that everything has gone as planned
      currentFile = result.filePath;
      saveFile();
      openFile(currentFile);
    }
    catch (err)
    {
      console.log(err)
    }
  }
  })
}

function createNewFile()
{
  //Opens dialog to confirm if there are unsaved changes
  ipcRenderer.invoke('confirm-losing-changes').then((result) => {
    if(result)
    {
      try
      {
        //clear the editor then update the state to reflect a plain text file
        editor.setValue('')
        showNotification("New file started")
        currentFile = undefined;
        language = "txt";
        detectLanguage();
        updateState();
      }
      catch (err)
      {
        showNotification("Failed to create new file")
        console.log(err)
      }
    }
 
  })
  //console.log("unsaved",unsavedChanges)
  
  
}

function showNotification(text)
{
  clearTimeout(currentNotification);
  var x = document.getElementById("snackbar");
  x.innerHTML = text;
  x.className = "show";
  var time = 2000 +(text.length*20)
  currentNotification = setTimeout(function(){ x.className = x.className.replace("show", ""); }, time);
}

function detectLanguage()
{
  //uses file extension to determine language mode
  switch(language) {
    case "js":
      setMode("javascript");
      break;
      case "java":
      setMode("java");
      break;
      case "html":
        setMode("html");
      break;
      case "py":
        setMode("python");
      break;
      case "css":
        setMode("css");
      break;
      case "cs":
        setMode("csharp");
      break;
      case "cpp":
        setMode("c_cpp");
      break;
      case "c":
        setMode("c");
      break;
      case "go":
        setMode("golang");
      break;
      case "json":
        setMode("json");
      break;
      case "lua":
        setMode("lua");
      break;
      case "md":
        setMode("markdown");
      break;
      case "txt":
        setMode("text");
      break;
      case "sql":
        setMode("sql");
      break;
      case "php":
        setMode("php");
      break;
      case "":
        setMode("text");
      break;
      case "xml":
        setMode("xml");
      break;
      case "py":
        setMode("python");
      break;
    default:
      setMode("text");
  } 
}

function compareSaveStateUpToDate()
{
  if(currentFile !== undefined)
  {
    //get the contents of the current file asyncronously
   return getContents(currentFile)
    .then( contents => 
      {
        return contents 
      })
      .then(result => 
        {
          //check if the contents of the editor are the same as the contents of the file
          if(result == editor.getValue())
        {
          //console.log("Files are the same")
          return true;
        }
        else
        {
          //  console.log("Files are not the same")
          return false;
        }
        })
    }
    else
    {
      //if no file is selected, check if any edits have been made to the editor that the user might want to save
      if(currentFile == undefined && editor.getValue() !== '')
      {
        return false;
      }
      else
      return true;
    }
}

function openNewFileUI()
{
  const {remote} = require('electron'),
  dialog = remote.dialog,
  WIN = remote.getCurrentWindow();  
  var lastfilepath = ""
  try{
    //get the path of the last opened file
    lastfilepath = (userSettings.recentFiles[userSettings.recentFiles.length-1]).substring(0, (userSettings.recentFiles[userSettings.recentFiles.length-1]).lastIndexOf("/"))
  }
  catch (err)
  {
    
  }
  //set options for dialog
  let options = {
    title : "Open file - GreenTea", 
    defaultPath : lastfilepath,
    buttonLabel : "Open",
    filters :[{name: 'All Files', extensions: ['*']}],
    properties: ['openFile']
  }

  //Synchronous, open the dialog
  let filePaths = dialog.showOpenDialog(WIN, options)
  filePaths.then(result => 
    {
      
    if(!result.canceled)
      {
        try
        {
          //open the selected file
          openFile(result.filePaths[0])
        }
        catch (err)
        {
          console.log(err)
        }
      }
    })
  

 }

function addToRecentFiles(path)
{
  //Check if the usersettings object has a .recentfiles attribute, if not create one and add the newly opened file to it
  if(userSettings.recentFiles == null)
  {
    userSettings.recentFiles = [];
    userSettings.recentFiles[0] = path;
    storeUserSettings();
  }
  else
  {
    var index = userSettings.recentFiles.indexOf(path);
    
    if (index > -1) {
      userSettings.recentFiles.splice(index, 1);
    }
      userSettings.recentFiles.push(path)
      //check if there are more than 8 items, if true remove the oldest one
    if(userSettings.recentFiles.length > 8)
    {
      userSettings.recentFiles.shift();
    }
      storeUserSettings();
  }
  //here we send list of recent files to main in order to create the list in the menu
  ipcRenderer.send('recent-files', userSettings.recentFiles)
  
}


//Example code for sending data between renderer and main process

//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
/*
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')*/


