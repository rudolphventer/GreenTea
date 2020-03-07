var editor;
var currentFile = undefined;
var language = "txt";

function start()
{
  initEditor();
  showNotification("Drag a file here to start editing")
}

function initEditor()
{
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/text");
  editor.setShowPrintMargin(false);
}

function openFile(dir)
{
  try
  {
    currentFile = dir
    getContents(dir)
    .then(result => {
      editor.setValue(result)
      showNotification(currentFile);
      language = currentFile.split('.').pop();
      detectLanguage();
      updateState();

    })
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
  detectLanguage();
  var mode = editor.session.$modeId;
  mode = mode.substr(mode.lastIndexOf('/') + 1);
  document.title = "GreenTea - "+currentFile + " - " + mode;
}

function saveFile()
{
  var fs = require('fs');

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
      editor.session.setMode("ace/mode/javascript");
      break;
      case "java":
      editor.session.setMode("ace/mode/java");
      break;
      case "html":
      editor.session.setMode("ace/mode/html");
      break;
      case "py":
      editor.session.setMode("ace/mode/python");
      break;
      case "css":
      editor.session.setMode("ace/mode/css");
      break;
      case "cs":
      editor.session.setMode("ace/mode/csharp");
      break;
      case "cpp":
      editor.session.setMode("ace/mode/c_cpp");
      break;
      case "c":
      editor.session.setMode("ace/mode/c");
      break;
      case "go":
      editor.session.setMode("ace/mode/golang");
      break;
      case "json":
      editor.session.setMode("ace/mode/json");
      break;
      case "lua":
      editor.session.setMode("ace/mode/lua");
      break;
      case "md":
      editor.session.setMode("ace/mode/markdown");
      break;
      case "txt":
      editor.session.setMode("ace/mode/text");
      break;
      case "sql":
      editor.session.setMode("ace/mode/sql");
      break;
      case "php":
      editor.session.setMode("ace/mode/php");
      break;
      case "":
      editor.session.setMode("ace/mode/text");
      break;
      case "xml":
      editor.session.setMode("ace/mode/xml");
      break;
      case "py":
      editor.session.setMode("ace/mode/python");
      break;
    default:
      editor.session.setMode("ace/mode/text");
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
          console.log("Files are the same")
          return true;
        }
        else
        {
          console.log("Files are not the same")
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


  let options = {
    title : "Open file - GreenTea", 
    defaultPath : "C:\\",
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