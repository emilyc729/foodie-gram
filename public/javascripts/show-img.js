function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(e.target.result);
            $('#img-place')
                .attr('style', `background-image: url('${e.target.result}'); background-size: cover; background-repeat: no-repeat;`);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$('#file-input').change(function(){
    readURL(this);
});