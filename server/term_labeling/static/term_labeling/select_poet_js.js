/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
let all_poets = [];

// A $( document ).ready() block.
$(document).ready(function () {
    getAllPoets().done(function (d) {
        all_poets = d['poets'];
        update_poets_list()
    });
    $(document).click(function (e) {
        if ($('#poetDropDown').is(':visible') && e.target.id !== "poetbtn" && e.target.className !== "poet-link" && e.target.id !== "poetInput") {
            $('#poetDropDown').toggle();
        } else if ($('#poemDropDown').is(':visible') && e.target.id !== "poembtn" && e.target.className !== "poems-link" && e.target.id !== "poemInput") {
            $('#poemDropDown').toggle();
        }
    });
});

function toggleDropDown(id) {
    if (id === 'poetDropDown')
        $('#poetDropDown').toggle();
    else {
        $('#poemDropDown').toggle();
    }
}


function update_poets_list() {
    let poetDropDown = document.getElementById('poetDropDown');
    let poets_html = "";
    all_poets.forEach(function (p) {
        poets_html += "<a href=\"#\" id=" + p.id + " class=\"poet-link\" onclick=\"choosePoet(this)\">" + p.name + "</a>";
    });
    poetDropDown.innerHTML += poets_html
}

function update_poems_list(poems_list, tagged_list) {
    const poetDropDown = document.getElementById('poemDropDown');
    let poems_html = "";
    poems_list.forEach(function (p) {
        if (tagged_list.some(item => item.poemID === p.id))
            poems_html += "<a href=\"#\" id=" + p.id + " style=\"color:blue\" class=\"poems-link\" onclick=\"choosePoem(this)\">" + p.name + "</a>";
        else poems_html += "<a href=\"#\" id=" + p.id + " class=\"poems-link\" onclick=\"choosePoem(this)\">" + p.name + "</a>";
    });
    while (poetDropDown.lastChild.id !== 'poemInput') {
        poetDropDown.removeChild(poetDropDown.lastChild);
    }
    poetDropDown.innerHTML += poems_html;
    document.getElementById('poetDiv').style.display = "block"
}

function getAllPoets() {
    return $.ajax({
        type: "GET",
        url: "get_all_poets/",
        dataType: "json"
    });
}


function filterFunction(dropDownId, inputId) {
    let input, filter, ul, li, a, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    let divv = document.getElementById(dropDownId);
    a = divv.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function choosePoet(obj) {
    const id = obj.id;
    const value = obj.text;
    let btn = document.getElementById("poetbtn");
    btn.innerText = value;
    document.getElementById("poetDiv").style.display = "none";
    document.getElementById("poembtn").innerText = "قصيدة";
    document.getElementById('btn-analyze').style.display = "none";
    toggleDropDown("poetDropDown");
    get_relevant(id).done(function (d) {
        const current_poems = d['poem_ids'];
        const tagged_poems = d["tagged"];
        update_poems_list(current_poems, tagged_poems)
    });
}

function choosePoem(obj) {
    const id = obj.id;
    const value = obj.text;
    let btn = document.getElementById("poembtn");
    btn.innerText = value;
    poemid = id;
    document.getElementById('btn-analyze').style.display = "inline-block"
    toggleDropDown("poemDropDown");
}

function get_relevant(id) {
    return $.ajax({
        type: "GET",
        url: "../poet_poems/",
        data: {
            'poet_id': id
        },
        dataType: "json"
    });

}

function submitPoem() {
    window.location = '/main_tag_page/?poem_id=' + poemid;
}
