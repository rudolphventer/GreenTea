const { ipcRenderer } = require('electron')
const fs = require('fs');

//Var to assign Ace Editor to
var editor;
//Initial setup of currentfile
var currentFile = undefined;
//lanuage is set as the file extension without the ".", this is used by the detectlanugage fgunction to determine which mode to set the editor to
var language = "txt";
//Toggles visibility of terminal
var terminalVisible = false;
//array that stores the lst 8 opened files, length-1 = the file opneed by "openLast" option
var recentFiles = [];
//Toggles opening the last file you were working on, tru is yes, false is no
var openLast = true;

var userSettings =
{
  "openLast": true,
  "recentFiles": [],
  "terminalVisible": false,
  "theme": "ace/theme/monokai",
  "editorTextSize": 11
}


function start()
{
  initEditor();
  showNotification("Drag a file here to start editing")
  //Creates right click context menu on main
  createContextMenu(); 
  //readUserSettings();

  ///////////////Until terminal is implemented//
  document.getElementById("terminal").style.display = "none";
  document.getElementById("editor").style.height = "100vh";
  //////////////////////////////////////////////

  //Here we listen for files being opened in the program, so stuff that is associated and uses greentea as the "default" program to open them or when you right click and click "Open with"
  var data = ipcRenderer.sendSync('get-file-data');
  //Get list of recent files from localstorage
  recentFiles = JSON.parse(readFromLocalStorage("recentFiles"));
  //Send recent files to the main thread to construct the recent files menu
  ipcRenderer.send('recent-files', recentFiles)

  //Checking if the program was opened via a file or as a new instance
  if (data !=  null && data !="." && fs.existsSync(data)) {
    openFile(data)
  } else {
    if(openLast)
    openLastFile()
  }
}

function readUserSettings()
{
  console.log(userSettings.openLast)
  userSettings = JSON.parse(readFromLocalStorage("userSettings"))
  console.log(userSettings.openLast)
}

function toggleOpenLast()
{
  //Toggles settig to open last file
  if(userSettings.hasOwnProperty("openLast"))
  {
      if(userSettings.openLast)
    {
      userSettings.openLast = false;
    }
    else
    {
      userSettings.openLast = true;
    }
  }
  else
  {
    userSettings.openLast = true
  }
  saveToLocalStorage("userSettings", JSON.stringify(userSettings))
}

function openLastFile()
{
  if(fs.existsSync(recentFiles[recentFiles.length-1]))
  {
      //check if the recent file value is null/invalid
      if(recentFiles != null && openLast && recentFiles.length > 0)
      {
        //Get most recent file from localstorage
        if(JSON.parse(readFromLocalStorage("recentFiles")) != null)
        openFile(recentFiles[recentFiles.length-1])
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


function initEditor()
{
  //Assign Ace Editor to the variable created in ~line 5
  editor = ace.edit("editor");
  //Get theme from localstorage, then set it, if no theme is set default to monokai
  if(readFromLocalStorage("currentTheme") != null)
  {
    setTheme(readFromLocalStorage("currentTheme"))
  }
  else
  {
    editor.setTheme("ace/theme/monokai");
  }
  //Let us know what theme is selected
  console.log("Theme: ",localStorage.getItem("currentTheme"))

  //Set default highlighting and remove print margin (because it's not 1990 anymore)
  editor.session.setMode("ace/mode/text");
  editor.setShowPrintMargin(false);

  //Get text size from localstorage or default to 11pt
  if(readFromLocalStorage(editorTextSize) != null)
  {
    editorTextSize(readFromLocalStorage(editorTextSize))
  }
  else
  {
    editor.setOptions({
      fontSize: "11pt"
    });
  }
}

function setTheme(theme)
{
  //Set theme on editor then save current theme to localstorage
  editor.setTheme("ace/theme/"+theme);
  saveToLocalStorage("currentTheme", theme);
}

function setMode(mode)
{
  //Sets highlight language mode in editor and updates state to "refresh" the user's view
  editor.session.setMode("ace/mode/"+mode);
  updateState();
}

function editorTextSize(sign)
{
  //If argument is +, increase size by 2 then save to locaststorage, the same with -, decreases size and saves to localstorage
  if(sign == "+")
  {
    var size = parseInt(editor.getFontSize().slice(0, -2)); 
    size += 2;
    showNotification(size+"pt")
    editor.setOptions({
      fontSize: size+"pt"
    });
    saveToLocalStorage("editorTextSize",size);
  }
  else
  if(sign == "-")
  {
    var size = parseInt(editor.getFontSize().slice(0, -2)); 
    size = size-2;
    showNotification(size+"pt")
    if(size > 3)
    {
      editor.setOptions({
        fontSize: size+"pt"
      });
      saveToLocalStorage("editorTextSize",size);
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
      saveToLocalStorage("editorTextSize",size);
    }
  }
  else
  {
    showNotification("Invalid size")
  }
}

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

function toggleTerminal()
{
  //Toggles terminal visible, purely with css values
  if(terminalVisible)
  {
    document.getElementById("terminal").style.display = "none";
    document.getElementById("editor").style.height = "100vh";
    terminalVisible = false;
  }
  else
  {
    document.getElementById("terminal").style.display = "initial";
    document.getElementById("editor").style.height = "80vh";
    terminalVisible = true;
  }
}

function openFile(dir)
{
  ipcRenderer.invoke('confirm-losing-changes').then((result) => {
    if(result)
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
  
  
})}

function getContents(dir)
{
  //Returns text value of opened file
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
//
function saveNewFile()
{
  const {remote} = require('electron'),
  dialog = remote.dialog,
  WIN = remote.getCurrentWindow();

  let options = {
  title: "Save new file - GreenTea",
  buttonLabel : "Save",
  filters :[{name: 'All Files', extensions: ['*']}],
  showOverwriteConfirmation : true
  }

  //Synchronous
  let filename = dialog.showSaveDialog(WIN, options)
  filename.then(result =>{
  console.log(result)
  if(!result.canceled)
  {
    try
    {
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
  var x = document.getElementById("snackbar");
  x.innerHTML = text;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function detectLanguage()
{
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
   return getContents(currentFile)
    .then( contents => 
      {
        return contents 
      })
      .then(result => 
        {
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
    lastfilepath = (recentFiles[recentFiles.length-1]).substring(0, (recentFiles[recentFiles.length-1]).lastIndexOf("/"))
  }
  catch (err)
  {
    
  }

  let options = {
    title : "Open file - GreenTea", 
    defaultPath : lastfilepath,
    buttonLabel : "Open",
    filters :[{name: 'All Files', extensions: ['*']}],
    properties: ['openFile']
  }

  //Synchronous
  let filePaths = dialog.showOpenDialog(WIN, options)
  filePaths.then(result => 
    {
      
    if(!result.canceled)
      {
        try
        {
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
  if(recentFiles == null)
  {
    recentFiles = [];
    recentFiles[0] = path;
    saveToLocalStorage("recentFiles", JSON.stringify(recentFiles));
  }
  else
  {
    var index = recentFiles.indexOf(path);
 
    if (index > -1) {
      recentFiles.splice(index, 1);
    }
      recentFiles.push(path)
    if(recentFiles.length > 8)
    {
      recentFiles.shift();
    }
      saveToLocalStorage("recentFiles", JSON.stringify(recentFiles));
    //here we send list of recent files to main in order to create the list in the menu
  }
  ipcRenderer.send('recent-files', recentFiles)
  
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


//Example code for sending data between renderer and main process

//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
/*
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')*/


