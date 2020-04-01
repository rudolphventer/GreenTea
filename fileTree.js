var structure = [];
var tree;
var workingDirectory;

function getFolder(dir)
{
  //Checks is new dir is under old dir, if yes then do not change the view
  if(!dir.includes(workingDirectory))
  {
    console.log("getting", dir)
    //Clearing the existing file tree because this does not work in the "getFolder" method
    var filetree = document.getElementById("tree")
    if(filetree.children.length > 0)
    {
      filetree.removeChild(filetree.firstChild)
    }
    //Sets current dir to new dir
    workingDirectory = dir;
    ipcRenderer.invoke('open-folder', dir).then((result) => {
    structure = [];
    structure.push(result)
    tree = new Tree(document.getElementById('tree'), {});
      //When a file is double clicked
    tree.on('action', e => openFile(e.node.path));
    return structure
}).then(result => {
    createTree(result)
})
  }
}

function createTree(filestructure)
{
    // keep track of the original node objects
  tree.on('created', (e, node) => {
    e.node = node;
  });
  tree.json(filestructure);
  //Expand the first level of the tree
  document.getElementById("tree").firstChild.children[1].setAttribute("open", "")
}

function openFolder()
{
  const {remote} = require('electron'),
  dialog = remote.dialog,
  WIN = remote.getCurrentWindow();  

  let options = {
    title : "Open folder - GreenTea", 
    buttonLabel : "Open",
    properties: ['openDirectory']
  }

  //Synchronous
  let filePaths = dialog.showOpenDialog(WIN, options)
  filePaths.then(result => 
    {
      
    if(!result.canceled)
      {
        try
        {
          //Clearing the existing file tree because this does not work in the "getFolder" method
          
          // this snippet of text appears soemwhere else on this page too, this does prevent you from opening soemthing in a subfolder as it will open the subfolder, discarding the current folder ***fix***
          getFolder(result.filePaths[0])
        }
        catch (err)
        {
          console.log(err)
        }
      }
    })
  

}