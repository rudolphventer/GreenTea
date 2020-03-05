var editor;
var currentFile = undefined;
var language = "text";

function start()
{
  Mousetrap.prototype.stopCallback = function () {
    return false;
  }
  Mousetrap.bind('ctrl+s', function() { 
      saveFile()
  });

  initEditor();

  showNotification("Drag a file here to start editing")
}

function initEditor()
{
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
}

function openFile(dir)
{
  try
  {
    currentFile = dir;
    fetch(dir)
    .then(response => response.text())
    .then(text => editor.setValue(text))
    .then(result => {
      showNotification(currentFile + " opened");
      language = currentFile.split('.').pop();
      console.log(language)
      detectLanguage();

    })
  }
  catch
  {
    showNotification("Failed to load file")
  }

  
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
  
  filters :[
    {name: 'All Files', extensions: ['*']}
  ]
  }

  //Synchronous
  let filename = dialog.showSaveDialog(WIN, options)
  filename.then(result =>{
    console.log("Filename",result.filePath)
    currentFile = result.filePath;
    saveFile();
  })
}


function showNotification(text)
{
  var x = document.getElementById("snackbar");
  x.innerHTML = text;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

function submitCommand()
{
  var x = document.getElementById("terminal").value;
  console.log(x);
}


function detectLanguage()
{
  switch(language) {
    case "js":
      editor.session.setMode("javascript");
      break;
      case "java":
      editor.session.setMode("java");
      break;
      case "html":
      editor.session.setMode("html");
      break;
      case "py":
      editor.session.setMode("python");
      break;
      case "css":
      editor.session.setMode("css");
      break;
      case "cs":
      editor.session.setMode("csharp");
      break;
      case "cpp":
      editor.session.setMode("c_cpp");
      break;
      case "c":
      editor.session.setMode("c");
      break;
      case "go":
      editor.session.setMode("golang");
      break;
      case "json":
      editor.session.setMode("json");
      break;
      case "lua":
      editor.session.setMode("lua");
      break;
      case "md":
      editor.session.setMode("markdown");
      break;
      case "txt":
      editor.session.setMode("text");
      break;
      case "sql":
      editor.session.setMode("sql");
      break;
      case "php":
      editor.session.setMode("php");
      break;
      case "":
      editor.session.setMode("text");
      break;
      case "xml":
      editor.session.setMode("xml");
      break;
      case "py":
      editor.session.setMode("python");
      break;
    default:
      editor.session.setMode("text");
  } 
  //console.log(editor.session.getMode())
}

  