var editor;
const { ipcRenderer } = require('electron')
var currentFile = undefined;
var language = "txt";
var terminalVisible = true;
var recentFiles = [];
var openLast = true;
var fs = require('fs');

function start()
{
  initEditor();
  showNotification("Drag a file here to start editing")
  //document.getElementById("terminal").textContent = "Microsoft Windows [Version 10.0.18362.657](c)\n2019 Microsoft Corporation. All rights reserved.\nC:\\Users\\Rudolph>"
  createContextMenu(); //creates context menu on main

  ///////////////Until terminal is implemented
  document.getElementById("terminal").style.display = "none";
  document.getElementById("editor").style.height = "100vh";
  //////////////////////////////////////////////

  //Here we listen for files being opened in the program, so stuff that is associated and uses greentea as the "default" program to open them or when you right click and click "Open with"
  var data = ipcRenderer.sendSync('get-file-data');
  recentFiles = JSON.parse(readFromLocalStorage("recentFiles"));
  console.log(recentFiles)
  ipcRenderer.send('recent-files', recentFiles)

  openLastFile()
  /*if (data !=  null && data !="." && fs.existsSync(data)) {
    console.log(data)
    openFile(data)
  } else {
    openLastFile()
  }*/
}

function openLastFile()
{
  console.log()
  if(JSON.parse(readFromLocalStorage("recentFiles")) != null && recentFiles != null && openLast && recentFiles.length > 0)
  {
    openFile(recentFiles[recentFiles.length-1])
  }
  else
  {
    console.log("create new file")
  }
}

function initEditor()
{
  editor = ace.edit("editor");
  
  console.log("theme: ",localStorage.getItem("currentTheme"))
  if(readFromLocalStorage("currentTheme") != null)
  {
    setTheme(readFromLocalStorage("currentTheme"))
    
  }
  else
  {
    editor.setTheme("ace/theme/monokai");
  }

  editor.session.setMode("ace/mode/text");
  editor.setShowPrintMargin(false);


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
  editor.setTheme("ace/theme/"+theme);
  saveToLocalStorage("currentTheme", theme);
}

function setMode(mode)
{
  editor.session.setMode("ace/mode/"+mode);
  updateState();
}

function editorTextSize(sign)
{
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
  try
  {
  return localStorage.getItem(name);
  }
  catch (err)
  {
    console.log(err);
  }
}

function toggleTerminal()
{
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
  console.log(dir)
  try
  {
    currentFile = dir
    getContents(dir)
    .then(result => {
      editor.setValue(result, 1)
      showNotification(currentFile);
      language = currentFile.split('.').pop();
      detectLanguage();
      updateState();
      addToRecentFiles(dir)
    })
    .catch(err => {console.log(err)})
  }
  catch (err)
  {
    console.log(err)
    showNotification("Failed to load file")
  }

  
}

function getContents(dir)
{
    return fetch(dir)
            .then(response => 
              {return response.text()})
            .catch( error => 
              {
                console.log(error);
                showNotification("Could not get contents of ", dir)
              })
}

function updateState()
{
  if(currentFile != undefined)
  {
    var mode = editor.session.$modeId;
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    document.title = "GreenTea - "+currentFile + " - " + mode;
  }
  else
  {
    var mode = editor.session.$modeId;
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    document.title = "GreenTea - "+"New File" + " - " + mode;
  }
}

function saveFile()
{

  if(currentFile === undefined)
  {
    saveNewFile();
  }
  else
  {
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

  let options = {
  title: "Save new file - GreenTea",
  defaultPath : "C:\\",
  buttonLabel : "Save",
  filters :[{name: 'All Files', extensions: ['*']}]
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

function showNotification(text)
{
  var x = document.getElementById("snackbar");
  x.innerHTML = text;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
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
          //console.log("Files are not the same")
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


