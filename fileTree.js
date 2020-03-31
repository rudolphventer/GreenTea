var structure = [];
var tree;

function getFolder(dir)
{
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

function createTree(filestructure)
{
    // keep track of the original node objects
  tree.on('created', (e, node) => {
    e.node = node;
  });
  tree.json(filestructure);
}



////////////////////////////////////////////////////////////////////////////////////////////

/* globals Tree
'use strict';

var tree = new Tree(document.getElementById('tree'), {
  navigate: true // allow navigate with ArrowUp and ArrowDown
});
tree.on('open', e => console.log('open', e));
tree.on('select', e => console.log('select', e));
tree.on('action', e => console.log('action', e));
tree.on('fetch', e => console.log('fetch', e));
tree.on('browse', e => console.log('browse', e));



document.getElementById('browse-1').addEventListener('click', () => {
  tree.browse(a => {
    if (a.node.name === 'folder 2 (asynced)' || a.node.name === 'file 2/2') {
      return true;
    }
    return false;
  });
});

document.getElementById('browse-2').addEventListener('click', () => {
  tree.browse(a => {
    if (a.node.name.startsWith('folder 1') || a.node.name === 'file 1/1/1/1/2') {
      return true;
    }
    return false;
  });
});

document.getElementById('unload').addEventListener('click', () => {
  const d = tree.hierarchy().pop();
  tree.unloadFolder(d);
});

document.getElementById('previous').addEventListener('click', () => {
  tree.navigate('backward');
});
document.getElementById('next').addEventListener('click', () => {
  tree.navigate('forward');
});
*/