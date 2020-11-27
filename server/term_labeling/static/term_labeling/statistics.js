

// connect to server and get the created word cloud based on period parameter.
function gen_cloud(p) {
    return $.ajax({
        type: "GET",
        url: "gen_cloud/",
        data: {'period': p},
        dataType: "json",
    });
}


// this function responsible for creating image of word cloud after receiving it from server.
function createWordCloud(obj,event){
    var el = obj.parentNode;
    el.style.display = "none"
    setTimeout(function() {
            el.style.removeProperty("display");
     }, 30);
     var src = document.getElementById("cloud");
     if (src.hasChildNodes()) {
          src.removeChild(src.childNodes[0]);
      }
     document.getElementById("loader").style.display = "block";
     gen_cloud(obj.innerText).done(function(d){

        var image = new Image();
        image.setAttribute("width", "900");
        image.setAttribute("height", "500");
        image.style.marginLeft = '100px';
        image.style.maringTop = '30px';
        image.src = d['image'];
        document.getElementById("loader").style.display = "none";
        src.appendChild(image);
     });
}