function start()
{
}

function loadFileAsText(){
    var fileToLoad = document.getElementById("Filedata").files[0];
  
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        
        editor.setValue(textFromFileLoaded);
    };
  
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

function update()
  {
    filepath = document.getElementById('Filedata')[0]
    console.log("content",filepath)
  };


  function dropOnSource(ev) {
    ev.preventDefault();
    console.log("test")
    var data = ev.dataTransfer.getData("text");
    console.log(data)
}


function drop()
{
  var holder = document.getElementById('drag-file');

  holder.ondragover = () => {
      return false;
  };

  holder.ondragleave = () => {
      return false;
  };

  holder.ondragend = () => {
      return false;
  };

  holder.ondrop = (e) => {
      e.preventDefault();

      for (let f of e.dataTransfer.files) {
          console.log('File(s) you dragged here: ', f.path)
      }
      
      return false;
  };
}