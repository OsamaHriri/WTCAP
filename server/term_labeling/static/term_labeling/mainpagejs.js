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
let selected_obj = "";
let orange = "rgb(255, 165, 0)";
let tagParent = ""
let depth = 0

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
            if (selected_obj != "" && selected_obj.css("color") === orange )
                selected_obj.css("color", "black");
            $(this).css("color", "orange");
            selected_obj = $(this);
            console.log("choosen term " + this.innerHTML);
            selected_term = this.innerHTML;
            load_suggestions(selected_term);
        });
    });
}

setTimeout(function () {
    $('.treeview').removeClass('hover');
}, 1000);

function add_tag(obj) {
    //const me = $(obj);
    const text = obj.getElementsByClassName("btn-txt");
    const tag_text = text[0].innerText.slice(0,text[0].innerText.lastIndexOf("-"))
    build_tag(tag_text);
}

let tagging = true;
let ul1;
let ul2;

function addNewRoot(text){
       return $.ajax({
        type: "GET",
        url: "add_root/",
        data: {'term': text},
        dataType: "json",
    });

    }

function add_new_tag(text){
       return $.ajax({
        type: "GET",
        url: "add_tag/",
        data: {'term': text,'parent':tagParent},
        dataType: "json",
    });
    }

function submit_clicked(){
    text = document.getElementById("newTag").value
    if(text==="")
      window.alert("The field is empty ,Please insert a tag before clicking");
    else{
       if(tagParent === ""){
        addNewRoot(text).done(function(d){
        if(d.Tag === false)
           window.alert("The tag already exist");
        else {
        emptyTree();
        getHeaders();
        }
        });
       } else {
            add_new_tag(text).done(function(d){
            if(d.Tag === false)
            window.alert("The tag already exist");
            else if (d.parent === false)
            window.alert("The parent doesnt exist");
            else {
            temp = document.getElementById("c").innerText.split(/\r?\n/)[0]
            emptyTree();
            item_clicked(temp);
            }

           });
       }

    }
    document.getElementById("newTag").value = "";
}

function Tagging(){

    var checkBox = document.getElementById("c1");
    if (checkBox.checked == true)
         tagging = true;
    else tagging = false;
}


function getParent(text){

    return $.ajax({
        type: "GET",
        url: "get_parent/",
        data: {'term': text},
        dataType: "json",
    });
}

function getHeaders(){
    $.ajax({
        type: "GET",
        url: "get_roots/",
        dataType: "json",
        success: function (data) {
            roots = data.roots;
            roots.forEach(build_il_headers)
            return ;
        }
    });



}


function emptyTree(){
    var ul = document.querySelector('.tree');
    var listLength = ul.children.length;
    for (i = 0; i < listLength; i++) {
        ul.removeChild(ul.children[0]);
       }
    if (typeof ul1 != 'undefined') {
        listLength = ul1.children.length;
        for (i = 0; i < listLength; i++) {
           ul1.removeChild(ul1.children[0]);
        }
    }
    if (typeof ul2 != 'undefined') {
        listLength = ul2.children.length;
        for (i = 0; i < listLength; i++) {
           ul2.removeChild(ul2.children[0]);
        }
    }}



function item_clicked1(obj,event){
    event.stopPropagation();
    const elem = $(obj);
    const text = elem[0].innerText.split(/\r?\n/)[0];
    if (tagging == true){
       build_tag(text);
       return;
     }
    if(event.target != obj)
       return;
    depth = depth -1;
    emptyTree();
    if (depth === 1)
       flag = false;
    item_clicked(text);
}

function item_clicked2(obj,event){
    event.stopPropagation();
    const elem = $(obj);
    const text = elem[0].innerText.split(/\r?\n/)[0];
    if (tagging == true){
       build_tag(text);
       return;
     }
    if(event.target != obj)
       return;
    emptyTree();
    if( depth === 1 && tagging === false)
       flag = true;
    item_clicked(text);
}

function item_clicked3(obj,event){
    event.stopPropagation();
    const elem = $(obj);
    const text = elem[0].textContent.split(/\r?\n/)[0];
    if (tagging == true){
        build_tag(text);
        return;
    }
    depth = depth + 1;
    emptyTree();
    if(depth === 1)
        flag = false;
    item_clicked(text);
}

function item_clicked(text) {
    tagParent = text;
    var ul = document.querySelector('.tree');
    getParent(text).done( function(data){
       var parent = data.parent;
       if (parent.length === 0 && flag === true) {
           getHeaders();
           depth =0;
           tagParent="";
           flag = false;
           return;
       }
       var current = document.createElement("il");
       if(parent.length> 0){
           var pNode=document.createElement("il");
           pNode.appendChild(document.createTextNode(parent[0].parent.name));
           pNode.setAttribute('onclick', "item_clicked1(this,event)");
           pNode.setAttribute('class', "parent");
           ul.appendChild(pNode);
           ul1 = document.createElement('ul');
           pNode.appendChild(ul1);
           ul1.appendChild(current);
       }
       current.appendChild(document.createTextNode(text));
       current.setAttribute('onclick', "item_clicked2(this,event)");
       current.setAttribute('class', "node");
       current.setAttribute('id', "c");
       current.setAttribute("style", "color: green");
       if(parent.length == 0)
           ul.appendChild(current);
       ul2 = document.createElement('ul');
       current.appendChild(ul2);
       $.ajax({
           type: "GET",
           url: "get_children/",
           data: {'term': text},
           dataType: "json",
           success: function (data) {
            const children = data.children;
            children.forEach(build_il)
            return ;
           }
       });
    });
   }

function build_il(item , index ){
       //var ul = document.querySelector('.tree');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(item.child.name));
        li.setAttribute('onclick', "item_clicked3(this,event)");
        li.setAttribute('class', "child");
        li.setAttribute("style", "color: black");
        ul2.appendChild(li);
}

function build_il_headers(item , index ){
        var ul = document.querySelector('.tree');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(item.root.name));
        li.setAttribute('onclick', "item_clicked3(this,event)");
        li.setAttribute('class', "child");
        ul.appendChild(li);
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
        if (selected_tags.indexOf(tag_name) >-1)
          window.alert("term already exist");
        else {
        selected_tags.push(tag_name);
        const container = document.getElementsByClassName('selected_container')[0];
        container.insertAdjacentHTML('beforeend', '<button class="tag-btn" onclick="remove_tag(this)">\n' +
            '                    <span class="rmv-icon">x</span>\n' +
            '                    <span class="btn-txt">' + tag_name + '</span>\n' +
            '                </button>')
    }}
}

function save_term_tag() {
    console.log(selected_term);
    console.log(selected_tags);
    selected_obj.css("color", "green");
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

    const container2 = document.getElementsByClassName('suggested_container')[0];
    const buttons2 = container2.getElementsByTagName('button');
    for (let i = buttons2.length - 1; i >= 0; --i) {
        buttons2[i].remove();
    }
    //add thingy that closes the row in table

}


function reset2() {
    selected_tags = [];
    const container = document.getElementsByClassName('selected_container')[0];
    const buttons = container.getElementsByTagName('button');
    for (let i = buttons.length - 1; i >= 0; --i) {
        buttons[i].remove();
    }

    const container2 = document.getElementsByClassName('suggested_container')[0];
    const buttons2 = container2.getElementsByTagName('button');
    for (let i = buttons2.length - 1; i >= 0; --i) {
        buttons2[i].remove();
    }
    //add thingy that closes the row in table

}

function load_suggestions(term) {
    $.ajax({
        type: "GET",
        url: "suggest_tags/",
        data: {'term': term},
        dataType: "json",
        success: function (data) {
            const suggestions = data.suggestions;
            reset2()
            suggestions.forEach(build_suggestion)
        }
    });
}

function build_suggestion(item, index){
    console.log(item);
    console.log(item.Tag.name + " " + item.Tag.frequency);

        const container = document.getElementsByClassName('suggested_container')[0];
        container.insertAdjacentHTML('beforeend', '<button class="sug-btn" onclick="add_tag(this)">\n' +
            '                    <span class="add-icon">+</span>\n' +
            '                    <span class="btn-txt">' + item.Tag.name + '-' + item.Tag.frequency + '</span>\n' +
            '                </button>')

}


window.onload = getHeaders();