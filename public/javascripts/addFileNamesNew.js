function previewMultiple(event) {
    var images = document.getElementById("image");
    var number = images.files.length;
    for (i = 0; i < number; i++) {
        var file = event.target.files[i];
        var urls = URL.createObjectURL(file);
        var filename = file.name;

      if(filename.length > 20){

      var filenameShort = filename.substring(0, 12);
    
        document.getElementById("formFile").innerHTML += '<div style="margin:6px;"><img crossorigin="anonymous" src="' + urls + '"><p>' + filenameShort + '...</p></div>';
      }
      else{
        document.getElementById("formFile").innerHTML += '<div style="margin:6px;"><img crossorigin="anonymous" src="' + urls + '"><p>' + filename + '</p></div>';
      }
      
    }
    document.getElementById("formFile").classList.add("text-center");
}

