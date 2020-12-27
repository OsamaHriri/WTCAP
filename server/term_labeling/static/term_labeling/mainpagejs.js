let selected_tags = [];
let selected_term = "";
let selected_obj = "";
let orange = "rgb(255, 165, 0)";
let tagParent = "";
let depth = 0;
let all_tags = [];
let viz;
let poemID;
let myUL;

$(document).ready(function () {
    getHeaders();
    var obj = document.getElementById("poem_id");
    poemID = obj.innerText;
    obj.remove();
    myUL = document.getElementById('myUL');
    $(document).click(function (e) {
        if ($('#tagsDropDown').is(':visible') && e.target.id != "mySearchInput" && e.target.className != "dropdownbox") {
            $('#tagsDropDown').hide();
        }
    });
    get_Tagged_Words(poemID).done(function (d) {
        data = d.word;
        document.querySelectorAll(".term").forEach(function (d) {
            const properties = d.id.split('_').map(x => +x)
            if (data.some(item => item.row === properties[0] && item.sader === properties[1] && item.position === properties[2])) {
                d.style.color = "green"
            }
        });
    });

    $(".term").click(function () {
        if (selected_obj !== "" && selected_obj.css("color") === orange)
            selected_obj.css("color", "black");
        $(this).css("color", "orange");
        selected_obj = $(this);
        selected_term = this.innerHTML;
        load_suggestions(selected_term);
    });

    // disable right click and show custom context menu
    $(".term").bind('contextmenu', function (e) {
        // const tag_text = this.innerText.slice(1, this.innerText.lastIndexOf("-"));
        // $("#txt_id").val(tag_text);

        const top = e.pageY + 5;
        const left = e.pageX;
        // Show contextmenu
        $(".term-menu").toggle(100).css({
            top: top + "px",
            left: left + "px"
        });
        // disable default context menu
        return false;
    });


    // Hide context menu
    $(document).bind('contextmenu click', function () {
        $(".term-menu").hide();
    });

    // disable context-menu from custom menu
    $('.term-menu').bind('contextmenu', function () {
        return false;
    });

    // Clicked context-menu item
    $('.term-menu a').click(function () {
        $(".term-menu").hide();
    });
});


function loadTags() {
    getAllTags().done(function (d) {
        all_tags = d.tags;
        update_tags_list()
    });
}

function update_tags_list() {
    myUL.innerHTML = "";
    all_tags.forEach(function (idx, li) {
        myUL.innerHTML += "<li><a href=\"javascript:void(0)\" id=" + idx + " onclick=\"searchTag(this)\">" + idx + "</a></li>";
    });
}


function filterSearch() {
    $('#tagsDropDown').show();
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("mySearchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

setTimeout(function () {
    $('.treeview').removeClass('hover');
}, 1000);

function add_tag(obj) {
    //const me = $(obj);
    const text = obj.getElementsByClassName("btn-txt");
    const tag_text = text[0].innerText.slice(0, text[0].innerText.lastIndexOf("-"));
    build_tag(tag_text);
}

let ul1;
let ul2;

function get_Tagged_Words(text) {
    return $.ajax({
        type: "GET",
        url: " getTaggedWords/",
        data: {'id': poemID},
        dataType: "json",
    });
}

function add_new_root(text) {
    return $.ajax({
        type: "GET",
        url: "add_root/",
        data: {'term': text},
        dataType: "json",
    });

}

function add_parent(text, parent) {
    return $.ajax({
        type: "GET",
        url: "add_parent/",
        data: {'term': text, 'parent': parent},
        dataType: "json",
    });
}

function changeParent(text, parent) {
    return $.ajax({
        type: "GET",
        url: "change_parent/",
        data: {'term': text, 'parent': parent},
        dataType: "json",
    });
}

function add_child(text, parent) {
    return $.ajax({
        type: "GET",
        url: "add_tag/",
        data: {'term': text, 'parent': parent},
        dataType: "json",
    });
}

function remove_tag(text) {
    return $.ajax({
        type: "GET",
        url: "remove_tag/",
        data: {'term': text},
        dataType: "json",
    });
}

function remove_tag_children(text) {
    return $.ajax({
        type: "GET",
        url: "delete_all/",
        data: {'term': text},
        dataType: "json",
    });
}

function editTag(text, edit) {
    return $.ajax({
        type: "GET",
        url: "edit_tag/",
        data: {'term': text, 'edit': edit},
        dataType: "json",
    });
}

function getDepth(text) {
    return $.ajax({
        type: "GET",
        url: "get_depth/",
        data: {'term': text},
        dataType: "json",
    });
}

function searchTag(obj) {
    getDepth(obj.innerText).done(function (d) {
        const elem = $(obj);
        const text = elem[0].innerText.split(/\r?\n/)[0];
        depth = d.depth + 1;
        emptyTree();
        if (depth === 1)
            flag = false;
        $('#tagsDropDown').toggle();
        item_clicked(text);
    });

}

function getParent(text) {
    return $.ajax({
        type: "GET",
        url: "get_parent/",
        data: {'term': text},
        dataType: "json",
    });
}

function getHeaders() {
    $.ajax({
        type: "GET",
        url: "get_roots/",
        dataType: "json",
        success: function (data) {
            let roots = data.roots;
            roots.forEach(build_il_headers);
        }
    });
}

function getAllTags(text) {
    return $.ajax({
        type: "GET",
        url: "get_all_tags/",
        dataType: "json",
    });

}


function change_parent() {
    text = document.getElementById("change-parent").value
    if (text === "")
        window.alert("The field is empty ,Please insert a tag before clicking");
    else {
        if (text === rightclicked) {
            window.alert("Error , you can`t add the term itself as parent");
            return
        }
        changeParent(rightclicked, text).done(function (d) {
            if (d.exist === false) {
                window.alert("The parent doesnt exist ,Please insert a valid one");
                return
            }
            if (d.change === false) {
                window.alert("Error ,you can't add a descendant tag as parent");
                return
            }
            document.getElementById("change-parent").value = ""
            search2(rightclicked)
            $('#changeParentModal').modal('hide')
        });

    }
}

function delete_tag() {
    getParent(rightclicked).done(function (d) {
        var parent = d.parent;
        remove_tag(rightclicked).done(function (d2) {
            document.getElementById(rightclicked).remove();
            all_tags = all_tags.filter(e => e !== rightclicked);
            if (parent.length === 0) {
                emptyTree();
                getHeaders();
                depth = 0;
                tagParent = "";
                flag = false;
            } else {
                search2(parent[0].parent.name)
            }
        });
    });
}

function delete_all() {
    getParent(rightclicked).done(function (d) {
        var parent = d.parent;
        remove_tag_children(rightclicked).done(function (d2) {
            all_tags = [];
            loadTags();
            if (parent.length === 0) {
                emptyTree();
                getHeaders();
                depth = 0;
                tagParent = "";
                flag = false;
            } else {
                search2(parent[0].parent.name)
            }
        });
    });
}

function new_parent() {

    text = document.getElementById("parent-name").value
    if (text === "")
        window.alert("The field is empty ,Please insert a tag before clicking");
    else {
        if (text === rightclicked) {
            window.alert("Error , you can`t add the term itself as parent");
            return
        }
        add_parent(rightclicked, text).done(function (d) {
            if (d.add == false) {
                window.alert("Error , the parent already exist somewhere");
                return
            }
            all_tags.push(text);
            myUL.innerHTML += "<li><a href=\"javascript:void(0)\" class=\"dropdownbox\" id=" + text + " onclick=\"searchTag(this)\">" + text + "</a></li>";
            document.getElementById("parent-name").value = "";
            search2(rightclicked);
            $('#insertParentModal').modal('hide')
        });
    }
}

function edit_tag() {
    text = document.getElementById("edited-name").value;
    editTag(rightclicked, text).done(function (d) {
        if (d.edit === false) {
            window.alert("Error , the edit name already exist");
            return
        }
        document.getElementById(rightclicked).remove();
        all_tags = all_tags.filter(e => e !== rightclicked);
        all_tags.push(text);
        myUL.innerHTML += "<li><a href=\"javascript:void(0)\" class=\"dropdownbox\" id=" + text + " onclick=\"searchTag(this)\">" + text + "</a></li>";
        document.getElementById("edited-name").value = "";
        emptyTree();
        if (tagParent === "") {
            getHeaders()
        } else if (tagParent === rightclicked)
            item_clicked(text);
        else {
            item_clicked(tagParent)
        }
        $('#editNameModal').modal('hide')
    });


}

function new_child() {
    text = document.getElementById("child-name").value
    if (text === "")
        window.alert("The field is empty ,Please insert a tag before clicking");
    else {
        if (text === rightclicked) {
            window.alert("Error , you can`t add the term itself as child");
            return
        }
        add_child(text, rightclicked).done(function (d) {
            if (d.Tag === false) {
                window.alert("The tag already exist");
                return
            }
            all_tags.push(text);
            myUL.innerHTML += "<li><a href=\"javascript:void(0)\" class=\"dropdownbox\" id=" + text + " onclick=\"searchTag(this)\">" + text + "</a></li>";
            document.getElementById("child-name").value = "";
            search2(rightclicked);
            $('#insertChildModal').modal('hide')
        });
    }
}

function new_root() {
    text = document.getElementById("root-name").value
    if (text === "")
        window.alert("The field is empty ,Please insert a tag before clicking");
    else {
        add_new_root(text).done(function (d) {
            if (d.Tag === false) {
                window.alert("The tag already exist");
                return
            }
            all_tags.push(text);
            myUL.innerHTML += "<li><a href=\"javascript:void(0)\" class=\"dropdownbox\" id=" + text + " onclick=\"searchTag(this)\">" + text + "</a></li>";
            document.getElementById("root-name").value = "";
            emptyTree();
            getHeaders();
            depth = 0;
            tagParent = "";
            flag = false;
            $('#insertRootModal').modal('hide')
        });
    }

}

function emptyTree() {
    const ul = document.querySelector('.tree');
    let listLength = ul.children.length;
    for (let i = 0; i < listLength; i++) {
        ul.removeChild(ul.children[0]);
    }
    if (typeof ul1 != 'undefined') {
        listLength = ul1.children.length;
        for (let i = 0; i < listLength; i++) {
            ul1.removeChild(ul1.children[0]);
        }
    }
    if (typeof ul2 != 'undefined') {
        listLength = ul2.children.length;
        for (let i = 0; i < listLength; i++) {
            ul2.removeChild(ul2.children[0]);
        }
    }
}

function item_clicked1(obj, event) {
    //clicking on parent
    event.stopPropagation();
    const elem = $(obj);
    const text = elem[0].innerText.split(/\r?\n/)[0];
    if (event.target !== obj)
        return;
    depth = depth - 1;
    emptyTree();
    if (depth === 1)
        flag = false;
    item_clicked(text);
}

function item_clicked2(obj, event) {
    //clicking on child depth 1
    event.stopPropagation();
    const elem = $(obj);
    const text = elem[0].innerText.split(/\r?\n/)[0];
    if (event.target !== obj)
        return;
    emptyTree();
    if (depth === 1)
        flag = true;
    item_clicked(text);
}

function item_clicked3(obj, event) {
    //clicking on child depth 2
    event.stopPropagation();
    const elem = $(obj);
    const text = elem[0].textContent.split(/\r?\n/)[0];
    depth = depth + 1;
    emptyTree();
    if (depth === 1)
        flag = false;
    item_clicked(text);
}

function item_clicked(text) {
    tagParent = text;
    const ul = document.querySelector('.tree');
    getParent(text).done(function (data) {
        const parent = data.parent;
        if (parent.length === 0 && flag === true) {
            getHeaders();
            depth = 0;
            tagParent = "";
            flag = false;
            return;
        }
        const current = document.createElement("il");
        if (parent.length > 0) {
            const pNode = document.createElement("il");
            pNode.appendChild(document.createTextNode(parent[0].parent.name));
            pNode.setAttribute('onclick', "item_clicked1(this,event)");
            pNode.setAttribute('oncontextmenu', 'right_click_tag(this, event)');
            pNode.setAttribute('class', "parent");
            ul.appendChild(pNode);
            ul1 = document.createElement('ul');
            pNode.appendChild(ul1);
            ul1.appendChild(current);
        }
        current.appendChild(document.createTextNode(text));
        current.setAttribute('onclick', "item_clicked2(this,event)");
        current.setAttribute('oncontextmenu', 'right_click_tag(this, event)');
        current.setAttribute('class', "node");
        current.setAttribute('id', "c");
        current.setAttribute("style", "color: green");
        if (parent.length === 0)
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
                children.forEach(build_il);
            }
        });
    });
}

function build_il(item, index) {
    //var ul = document.querySelector('.tree');
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(item.child.name));
    li.setAttribute('onclick', "item_clicked3(this, event)");
    li.setAttribute('oncontextmenu', 'right_click_tag(this, event)');
    li.setAttribute('class', "child");
    li.setAttribute("style", "color: black");
    ul2.appendChild(li);
}

function build_il_headers(item, index) {
    var ul = document.querySelector('.tree');
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(item.root.name));
    li.setAttribute('onclick', "item_clicked3(this,event)");
    li.setAttribute('oncontextmenu', 'right_click_tag(this, event)');
    li.setAttribute('class', "child");
    ul.appendChild(li);
}

function remove_tag_in_selected(obj) {
    const elem = $(obj);
    const btn = elem[0].getElementsByClassName("btn-txt");
    const text = btn[0].innerHTML;
    const index = selected_tags.indexOf(text);
    if (index > -1) {
        selected_tags.splice(index, 1);
    }
    elem.remove();
}

let rightclicked = "";

function right_click_tag(obj, e) {
    e.stopPropagation();
    //prevent default menu
    e.preventDefault();

    const text = obj.innerText.split(/\r?\n/)[0];
    if (e.target != obj)
        return;
    rightclicked = text;
    const top = e.pageY + 5;
    const left = e.pageX;
    // Show contextmenu
    $(".tag-menu").toggle(100).css({
        top: top + "px",
        left: left + "px"
    });

    // Hide context menu
    $(document).bind('contextmenu click', function () {
        $(".tag-menu").hide();
    });

    // disable context-menu from custom menu
    $('.tag-menu').bind('contextmenu', function () {
        return false;
    });

    // Clicked context-menu item
    $('.tag-menu a').click(function () {
        $(".tag-menu").hide();
    });
}


function right_click_tag1(obj, e) {
    event.stopPropagation();
    //prevent default menu
    e.preventDefault();
    build_tag(obj.innerText.split(/\r?\n/)[0])
}

function build_tag(tag_name) {
    if (selected_term === "") {
        window.alert("first choose a term");
    } else {
        if (selected_tags.indexOf(tag_name) > -1)
            window.alert("term already exist");
        else {
            selected_tags.push(tag_name);
            const container = document.getElementsByClassName('selected_container')[0];
            container.insertAdjacentHTML('beforeend', '<button class="btn btn-sm tag-btn" onclick="remove_tag_in_selected(this)">\n' +
                '                    <i class=\'fas fa-minus\'></i>' + '&nbsp;' +
                '                    <span class="btn-txt">' + tag_name + '</span>\n' +
                '                </button>')
        }
    }
}

function save_term_tag() {
    selected_obj.css("color", "green");
    const term_id = selected_obj.attr('id').split('_');
    for (const tag of selected_tags) {
        $.ajax({
            type: "GET",
            url: "save_term_tags/",
            data: {
                'row': term_id[0],
                'place': term_id[1],
                'position': term_id[2],
                'term': selected_term,
                'tag': tag,
                'id': poemID
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
            reset2();
            suggestions.forEach(build_suggestion)
        }
    });
}

function build_suggestion(item, index) {
    const container = document.getElementsByClassName('suggested_container')[0];
    container.insertAdjacentHTML('beforeend', '<button class="btn btn-sm tag-btn" onclick="add_tag(this)"> \n' +
        '                   <i class=\'fas fa-plus\'></i>' + '&nbsp;' +
        '                    <span class="btn-txt">' + item.Tag.name + '-' + item.Tag.frequency + '</span>\n' +
        '                </button>');

    // disable right click and show custom context menu
    $(".tag-btn").bind('contextmenu', function (e) {
        const tag_text = this.innerText.slice(1, this.innerText.lastIndexOf("-"));
        $("#txt_id").val(tag_text);

        const top = e.pageY + 5;
        const left = e.pageX;
        // Show contextmenu
        $(".context-menu").toggle(100).css({
            top: top + "px",
            left: left + "px"
        });
        // disable default context menu
        return false;
    });

    // Hide context menu
    $(document).bind('contextmenu click', function () {
        $(".context-menu").hide();
    });

    // disable context-menu from custom menu
    $('.context-menu').bind('contextmenu', function () {
        return false;
    });

    // Clicked context-menu item
    $('.context-menu a').click(function () {
        $(".context-menu").hide();
    });
}

function suggestionRightClick() {
    let sugg = $('#txt_id').val();
    sugg = sugg.replace(/^\s+|\s+$/g, '');
    searchSuggestion(sugg);
}

function searchSuggestion(text) {
    getDepth(text).done(function (d) {
        depth = d.depth + 1;
        emptyTree();
        if (depth === 1)
            flag = false;
        item_clicked(text);
    });
}

function draw() {
    $('#viz').ready(function () {
        statement = "match p=()-[r:tag{poemID:'$'}]->() RETURN p".replace('$', poemID)
        var config = {
            container_id: "viz",
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "123123147",
            labels: {
                "Tag": {
                    "caption": "name",
                    //"size": "pagerank",
                    //"community": "community",
                    "title_properties": [
                        "name"
                    ]
                },
                "Word": {
                    "caption": "name",
                    //"size": "pagerank",
                    //"community": "community",
                    "title_properties": [
                        "name"
                    ]
                }
            },
            relationships: {
                "tag": {
                    //"thickness": "weight",
                    "caption": false
                }
            },
            arrows: true,
            initial_cypher: statement
        };

        viz = new NeoVis.default(config);
        viz.render();
    });
}


function refreshVis() {
    viz.reload()
}


function search2(text) {
    getDepth(text).done(function (d) {
        depth = d.depth + 1;
        emptyTree();
        if (depth === 1)
            flag = false;
        item_clicked(text);
    });
}


