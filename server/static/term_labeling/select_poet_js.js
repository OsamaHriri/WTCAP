/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
let poemid = 2066;
let all_poems = [];
let all_poets = [];

// A $( document ).ready() block.
$(document).ready(function () {
    console.log("on load");
    getAllPoets().done(function (d) {
        all_poets = d['poets'];
        update_poets_list()
    });
    getAllPoems().done(function (d) {
        all_poems = d['poems'];
        update_poems_list(all_poems)
    });
});

function myFunction(id) {
    document.getElementById(id).classList.toggle("show");
    /*
    if (id === 'poetDropDown') {
        resetPoems();
    }*/
}


function update_poets_list() {
    let poetDropDown = document.getElementById('poetDropDown');
    let poets_html = "";
    all_poets.forEach(function (p) {
        poets_html += "<a href=\"#\" id=" + p.id + "class=\"poet-link\" onclick=\"choosePoet(this)\">" + p.name + "</a>";
    });
    poetDropDown.innerHTML += poets_html
}

function update_poems_list(poems_list) {
    let poetDropDown = document.getElementById('poemDropDown');
    let poems_html = "";
    poems_list.forEach(function (p) {
        poems_html += "<a href=\"#\" id=" + p.id + "class=\"poems-link\" onclick=\"choosePoem(this)\">" + p.name + "</a>";
    });
    poetDropDown.innerHTML += poems_html;
}

function getAllPoems() {
    return $.ajax({
        type: "GET",
        url: "get_all_poems/",
        dataType: "json",
    });
}

function getAllPoets() {
    return $.ajax({
        type: "GET",
        url: "get_all_poets/",
        dataType: "json",
    });
}


function filterFunction(dropDownId, inputId) {
    let input, filter, ul, li, a, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropDownId);
    a = div.getElementsByTagName("a");
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
    myFunction("poetDropDown");
    keep_relevant(id);
}

function choosePoem(obj) {
    const id = obj.id;
    const value = obj.text;
    let btn = document.getElementById("poembtn");
    btn.innerText = value;
    poemid = id;
    myFunction("poemDropDown");

}

function keep_relevant(id) {
    $.ajax({
        type: "GET",
        url: "../poet_poems/",
        data: {
            'poet_id': id
        },
        success: function (data) {
            const splitteddata = data.split(",");
            $(".poems-link").each(function () {
                const currpoem = this.id;
                if (($.inArray(currpoem, splitteddata)) === -1) {
                    this.remove();
                }
            });
            return data;
        }
    });

}

function submitPoem() {
    console.log(poemid);
    window.location = '/main_tag_page/?poem_iid=' + poemid;
}
