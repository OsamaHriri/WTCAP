


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
        image.setAttribute("width", "900");
        image.setAttribute("height", "500");
        image.style.marginLeft = '100px';
        image.style.maringTop = '30px';
        image.src = d['image'];
        src.appendChild(image);
     });
}