function previewFile() {
  
       var file = $( "input:file" ).files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            $('#img-place').attr('style', `background-image: url('${reader.result}'); background-size: cover; background-repeat: no-repeat;`);
          }, false);
        
          if (file) {
            reader.readAsDataURL(file);
          }
/*
        reader.onload = function (e) {
            console.log(e.target.result);
            $('#img-place')
                .attr('style', `background-image: url('${e.target.result}'); background-size: cover; background-repeat: no-repeat;`);
        };
        $( "input:file" )

        reader.readAsDataURL(input.files[0]);
        */
    
}