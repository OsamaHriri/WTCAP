


function gen_cloud(p) {
    return $.ajax({
        type: "GET",
        url: "gen_cloud/",
        data: {'period': p},
        dataType: "json",
    });
}

function createWordCloud(obj,event){
    var el = obj.parentNode;
    el.style.display = "none"
    setTimeout(function() {
            el.style.removeProperty("display");
     }, 30);
     gen_cloud(obj.innerText).done(function(d){
        var src = document.getElementById("cloud");
        if (src.hasChildNodes()) {
            src.removeChild(src.childNodes[0]);
        }
        var image = new Image();
        image.style.height = '500px';
        image.style.width = '1000px'
        image.src = d['image'];
        src.appendChild(image);
     });
}