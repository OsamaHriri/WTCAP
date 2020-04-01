function ul(index) {
    console.log('click!' + index)
    var underlines = document.querySelectorAll(".underline");
    for (var i = 0; i < underlines.length; i++) {
        underlines[i].style.transform = 'translate3d(-' + index * 100 + '%,0,0)';
    }
}

function dodrop(event) {
    var dt = event.dataTransfer;
    var files = dt.files;

    var count = files.length;
    output("File Count: " + count + "\n");

    for (var i = 0; i < files.length; i++) {
        output(" File " + i + ":\n(" + (typeof files[i]) + ") : <" + files[i] + " > " +
            files[i].name + " " + files[i].size + "\n");
    }
}

function output(text) {
    document.getElementById("output").textContent += text;
    //dump(text);
}

var termclick = false;

function termclicked() {
    var term = document.getElementById("term");
    term.style.color = "darkgreen";
    termclick = true
}

function createDIV() {
    if (!termclick) {
        var term = document.getElementById("term");
        term.style.color = "grey";
        // update the div's location 
        var divElement = document.createElement("DIV");
        // a list of tags we want to show the user (add "suggestions" for terms that were tagged before)
        var list = ["ايجابي", "سلبي", "انسان", "حيوان"];
        var size = list.length;
        for (i = 0; i < size; i++) {
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "name";
            checkbox.value = "value";
            checkbox.id = "id" + i;
            var label = document.createElement('label');
            var tn = document.createTextNode(list[i]);
            label.htmlFor = "id" + i;
            label.appendChild(tn);
            divElement.appendChild(label);
            divElement.appendChild(checkbox);
        }
        divElement.className = "myDivClass";
        document.body.appendChild(divElement);
    }
}

function resethover() {
    if (!termclick) {
        var term = document.getElementById("term");
        term.style.color = "black";
        var div = document.getElementsByTagName('DIV'),
            i;
        for (i = div.length - 1; i >= 0; i--) {
            div[i].parentNode.removeChild(div[i]);
            return false;
        }
    }
}