function ul(index) {
    console.log('click!' + index)
    var underlines = document.querySelectorAll(".underline");
    for (var i = 0; i < underlines.length; i++) {
        underlines[i].style.transform = 'translate3d(-' + index * 100 + '%,0,0)';
    }
}

var termclick = false;

function termclicked(var_id) {
    var term = document.getElementById(var_id);
    term.style.color = "darkgreen";
    termclick = true
}

function createDIV(var_id) {
    if (!termclick) {
        var term = document.getElementById(var_id);
        term.style.color = "grey";
        // update the div's location 
        var divElement = document.getElementById("tagsdiv");
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
        document.body.appendChild(divElement);
        var text = term.innerText;
        var dif = document.getElementById("difdiv")
            // add the definition you get from osama's python

    }
}

function resethover(var_id) {
    if (!termclick) {
        var term = document.getElementById(var_id);
        term.style.color = "black";
        var div = document.getElementsByTagName('DIV'),
            i;
        for (i = div.length - 1; i >= 0; i--) {
            div[i].parentNode.removeChild(div[i]);
            return false;
        }
    }
}