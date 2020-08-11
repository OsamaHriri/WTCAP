/*
this method initializes the main page (index):
1. set all checkboxes to false
 */


function initialize_index() {
    let checkboxes;
    checkboxes = document['poem-form'].getElementsByTagName('input');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type === 'checkbox') {
            checkboxes[i].checked = false;
        }
    }
}

/* this method is for the select all checkbox */
function toggle(source) {
    box_checked(source);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] !== source)
            checkboxes[i].checked = source.checked;
    }

}

let selected_tags = [];
let selected_term = "";

function box_checked(obj) {
    const id = obj.id;
    const ok = document.getElementById(id);
    const tbl = document.getElementById("poem");
    // check if we added the row already, if yes remove it and add it again ?
    const added = document.getElementById('added');
    if (added) {
        added.parentNode.removeChild(added);
    }
    const row = tbl.insertRow(Number(id));
    row.setAttribute('id', 'added');

    const sentence = tbl.rows[id - 1];
    const sadr = sentence.cells[1];
    const ajuz = sentence.cells[2];

    //split sadr
    const sadrtext = sadr.textContent.split(" ");
    let newsadr = "<p>";
    for (let i = 0; i < sadrtext.length; i++) {
        newsadr = newsadr + "<span class='term'> " + sadrtext[i] + " " + "</span>"
    }
    newsadr = newsadr + "</p>"
    sadr.innerHTML = newsadr;

    //split ajuz
    const ajuztext = ajuz.textContent.split(" ");
    let newsajuz = "<p>";
    for (let i = 0; i < ajuztext.length; i++) {
        newsajuz = newsajuz + "<span class='term'> " + ajuztext[i] + " " + "</span>"
    }
    newsajuz = newsajuz + "</p>";
    ajuz.innerHTML = newsajuz;

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

// Add some text to the new cells:
    cell2.innerHTML = "اختر كلمة";
    cell3.innerHTML = "<button type='button' class='btn' onclick='save_term_tag()'> Save </button>";
    cell1.innerHTML = "<button type='button' class='btn disabled' > + </button>";
    hi(id);
}


//can remove
function hi(id) {
    $(function () {
        $(".term").click(function () {
            $(this).css("color", "green");
            console.log("choosen term " + this.innerHTML);
            selected_term = this.innerHTML;
            load_suggestions(selected_term)
            $.ajax({
                type: "POST",
                url: "newexternal/",
                dataType: "json",
                success: function (data) {
                    console.log(data);

                    window.alert(data)
                }
            });
        });
    });
}

setTimeout(function () {
    $('.treeview').removeClass('hover');
}, 1000);

function add_tag(obj) {
    //const me = $(obj);
    const text = obj.getElementsByClassName("btn-txt");
    const tag_text = text[0].innerText;
    build_tag(tag_text);
}

function item_clicked(obj) {
    const elem = $(obj);
    const text = elem[0].innerText;
    build_tag(text);
}

function remove_tag(obj) {
    const elem = $(obj);
    const btn = elem[0].getElementsByClassName("btn-txt");
    const text = btn[0].innerHTML;
    const index = selected_tags.indexOf(text);
    if (index > -1) {
        selected_tags.splice(index, 1);
        console.log("after removal : " + selected_tags)
    }
    elem.remove();
}

function build_tag(tag_name) {
    if (selected_term === "") {
        window.alert("first choose a term");
    } else {
        selected_tags.push(tag_name);
        const container = document.getElementsByClassName('selected_container')[0];
        container.insertAdjacentHTML('beforeend', '<button class="tag-btn" onclick="remove_tag(this)">\n' +
            '                    <span class="rmv-icon">x</span>\n' +
            '                    <span class="btn-txt">' + tag_name + '</span>\n' +
            '                </button>')
    }
}

function save_term_tag() {
    console.log(selected_term);
    console.log(selected_tags);
    for (const tag of selected_tags) {
        console.log("on " + tag);
        $.ajax({
            type: "GET",
            url: "save_term_tags/",
            data: {
                'term': selected_term,
                'tag': tag
            },
            success: function (data) {
                console.log(data);
            }
        });
    }
    reset();
}

function reset() {
    selected_term = "";
    selected_tags = [];
    const container = document.getElementsByClassName('selected_container')[0];
    const buttons = container.getElementsByTagName('button');
    for (let i = buttons.length - 1; i >= 0; --i) {
        buttons[i].remove();
    }

    //add thingy that closes the row in table

}

function load_suggestions(term){
     $.ajax({
                    type: "GET",
                    url: "suggest_tags/",
                    data: {'term':term},
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        window.alert(data)
                    }
                });

}