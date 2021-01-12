let selected_term = "";
let selected_obj = "";
let right_clicked = "";
let orange = "rgb(255, 165, 0)";
let tagParent = "";
let depth = 0;
let all_tags = [];
let viz;
let poemID;
let myUL;
let tagged_terms_list;
let suggested_term_list;
let allroots;

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
    get_words_analyzation(poemID).done(function (d) {
        tagged_terms_list = d.tagged;
        suggested_term_list = d.suggested
        tagged_terms_list.forEach(function (d) {
            const id = d.row + "_" + d.sader + "_" + d.position
            document.getElementById(id).style.color = "green"
        });
        suggested_term_list.forEach(function (d) {
            if (!tagged_terms_list.some(item => item.row === d.row && item.sader === d.sader && item.position === d.position)) {
                const id = d.row + "_" + d.sader + "_" + d.position
                document.getElementById(id).style.color = "blue"
            }
        });
        allroots = d.roots
        tooltips = $('[data-toggle="tooltip"]').tooltip()
        tooltips.each(function(ndx, elem) {
            $(elem).attr('title', allroots[elem.innerHTML.trim()])
              .tooltip('_fixTitle')
        })
     });
    $("#collapseOne").collapse('hide');
    $("#collapseThree").collapse('show');
    $(".term").click(function () {
            if (selected_obj !== "" && selected_obj.css("color") === orange) {
                const properties = selected_obj.attr('id').split('_').map(x => +x);
                if (tagged_terms_list.some(item => item.row === properties[0] && item.sader === properties[1] && item.position === properties[2])) {
                    selected_obj[0].style.color = "green"
                } else{
                        selected_obj[0].style.color = "black"
                      }
            }
            if(second_term != "")
                second_term[0].style.color = "black"
            second_term = ""
            full_term = ""
            merging = false
            reset();
            $(this).css("color", "orange");
            selected_obj = $(this);
            selected_term = this.innerHTML;
            term_current_tags();
            load_suggestions(selected_term);
    }).bind('contextmenu', function (e) {// disable right click and show custom context menu
        right_clicked = this.innerHTML
        if(merging == false)
            second_term = $(this)
        close_open_windows()
        const windowHeight = $(window).height()+$(window).scrollTop();
        const top = e.pageY +5;
        const left = e.pageX;
        const menuHeight = $(".term-menu").outerHeight();
        var y = top;
        if(windowHeight < menuHeight + top ){
            y = windowHeight - menuHeight
        }
        // Show contextmenu
        $(".term-menu").toggle(100).css({
            top: y + "px",
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


function close_open_windows(){
    if ($('#tag-menu').is(':visible')) {
         $('#tag-menu').hide();
    }
    if ($('#term-menu').is(':visible')) {
            $('#term-menu').hide();
    }
}

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
    save_term_tag(tag_text).done(function (d) {
        if (d === "Success") {
            const term_id = selected_obj.attr('id').split('_').map(x => +x)
            if (!tagged_terms_list.some(item => item.row === d.row && item.sader === d.sader && item.position === d.position)) {
                tagged_terms_list.push({position: term_id[2], row: term_id[0], sader: term_id[1]});
            }
            build_tag(tag_text);
            $("#collapseOne").collapse("show")
            obj.remove()
            if($('.suggested_container').children().length == 0){
                $("#collapseTwo").collapse("hide")
            }
        } else {
            window.alert("something went Wrong, reClick again on the term")
        }
    });
}

let ul1;
let ul2;

function get_words_analyzation(text) {
    return $.ajax({
        type: "GET",
        url: " get_words_analyzation/",
        data: {'id': poemID},
        dataType: "json",
    });
}

function getRootofWord(text){
   return $.ajax({
        type: "GET",
        url: " get_Root_of_Word/",
        data: {'word': text},
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

function remove_tag_from_word(text, term_id) {
     var t = selected_term
     if(merging == true)
        t = full_term
    return $.ajax({
        type: "GET",
        url: "remove_tag_from_word/",
        data: {
            'row': term_id[0],
            'place': term_id[1],
            'position': term_id[2],
            'term': t,
            'tag': text,
            'id': poemID
        },
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
    text = document.getElementById("change-parent").value;
    if (text === "") {
        // window.alert("The field is empty ,Please insert a tag before clicking");
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "The field is empty ,Please insert a tag before clicking";
        timeout();
    } else {
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

    text = document.getElementById("parent-name").value;
    if (text === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "The field is empty ,Please insert a tag before clicking";
        timeout();
    }
    // window.alert("The field is empty ,Please insert a tag before clicking");
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
            close_modal('#insertParentModal');
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
        close_modal('#editNameModal');
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
            close_modal('#insertChildModal');
        });
    }
}

function new_root() {
    const text = document.getElementById("root-name").value;
    if (text === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "The field is empty ,Please insert a tag before clicking";
        timeout();
    }
    // window.alert("The field is empty ,Please insert a tag before clicking");
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
            close_modal('#insertRootModal')
        });
    }

}

function close_modal(id) {
    $(id).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
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
    close_open_windows()
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
    close_open_windows()
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
    close_open_windows()
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
    var term_id = selected_obj.attr('id').split('_');
    remove_tag_from_word(text, term_id).done(function (d) {
        if (d.exist == true && d.last == true) {
            term_id = term_id.map(x => +x)
            tagged_terms_list = tagged_terms_list.filter(function (value, index, arr) {
                if (value.position == term_id[2] && value.row == term_id[0] && value.sader == term_id[1])
                    return false;
                else return true;
            });
            $("#collapseOne").collapse("hide")
        }
        elem.remove();
    });
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
    close_open_windows()
    const windowHeight = $(window).height()+$(window).scrollTop();
    const windowWidth = $(window).width()+$(window).scrollLeft();
    const top = e.pageY +5;
    const left = e.pageX;
    const menuHeight = $(".tag-menu").outerHeight();
    const menuwidth = $(".tag-menu").outerWidth();
    // Show contextmenu
    var x = left;
    var y = top;
    if(windowHeight < top + menuHeight) {
            y = windowHeight - menuHeight - 5
    }
    if(windowWidth < left + menuwidth ){
            x = left  - menuwidth -5
    }

    $(".tag-menu").toggle(100).css({
            top: y + "px",
            left: x + "px"
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


function add_tag_to_selected(obj, e) {
    event.stopPropagation();
    //prevent default menu
    e.preventDefault();
    if (merging == false && selected_term === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "First you need to choose a term";
        timeout();

    } else {
        save_term_tag(rightclicked).done(function (d) {
            if (d == "Success") {
                const term_id = selected_obj.attr('id').split('_').map(x => +x)
                if (!tagged_terms_list.some(item => item.row === d.row && item.sader === d.sader && item.position === d.position)) {
                    tagged_terms_list.push({position: term_id[2], row: term_id[0], sader: term_id[1]});
                }
                build_tag(rightclicked);
                 $("#collapseOne").collapse("show")
            } else {
                $("#myToast").attr("class", "toast show danger_toast").fadeIn();
                document.getElementById("toast-body").innerHTML = "Something went wrong, maybe the tag exists";
                timeout();
            }
        });
    }
}

function timeout() {
    setTimeout(function () {
        $("#myToast").fadeOut().attr('class', 'toast danger_toast');
    }, 2500);
}

function build_tag(tag_name) {
    const container = document.getElementsByClassName('selected_container')[0];
    container.insertAdjacentHTML('beforeend', '<button class="btn btn-sm tag-btn" onclick="remove_tag_in_selected(this)">\n' +
        '                    <i class=\'fa fa-minus\'></i>' + '&nbsp;' +
        '                    <span class="btn-txt">' + tag_name + '</span>\n' +
        '                </button>')

}


function save_term_tag(tag) {
    const term_id = selected_obj.attr('id').split('_');
    var t = selected_term
    if(merging == true)
        t = full_term

    return $.ajax({
        type: "GET",
        url: "save_term_tag/",
        data: {
            'row': term_id[0],
            'place': term_id[1],
            'position': term_id[2],
            'term': t,
            'tag': tag,
            'id': poemID
        },
    });
}

function reset() {
    selected_term = "";
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
    const term_id = selected_obj.attr('id').split('_');
    $.ajax({
        type: "GET",
        url: "suggest_tags/",
        data: {
            'row': term_id[0],
            'place': term_id[1],
            'position': term_id[2],
            'term': term,
            'id': poemID
        },
        dataType: "json",
        success: function (data) {
            const suggestions = data.suggestions;
            if (suggestions === undefined || suggestions.length == 0) {
                $("#collapseTwo").collapse("hide")
             }
             else{
                suggestions.forEach(build_suggestion)
                $("#collapseTwo").collapse("show")
        }}
    });
}

function term_current_tags() {
    const term_id = selected_obj.attr('id').split('_');
    $.ajax({
        type: "GET",
        url: "term_current_tags/",
        data: {
            'row': term_id[0],
            'place': term_id[1],
            'position': term_id[2],
            'id': poemID
        },
        dataType: "json",
        success: function (data) {
        if (data.tags === undefined || data.tags.length == 0) {
            $("#collapseOne").collapse("hide")

        } else {
            const tags_term = data.tags.map(a => a.tag);
            tags_term.forEach(build_tag)
            $("#collapseOne").collapse("show")
        }}
    });
}

function build_suggestion(item, index) {
    const container = document.getElementsByClassName('suggested_container')[0];
    container.insertAdjacentHTML('beforeend', '<button class="btn btn-sm tag-btn" onclick="add_tag(this)"> \n' +
        '                   <i class=\'fa fa-plus\'></i>' + '&nbsp;' +
        '                    <span class="btn-txt">' + item[0] + '-' + parseFloat(item[1].toFixed(4)) + '</span>\n' +
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

function back_home() {
    emptyTree();
    getHeaders();
    depth = 0;
    tagParent = "";
    flag = false;
}

$('#showAllModal').on('shown.bs.modal', function (e) {
    const src = document.getElementById("listTable");
    while (src.lastChild.id !== 'Fchild') {
        src.removeChild(src.lastChild);
    }
    src.innerHTML += "<tbody></tbody>"
    var arr = []
    document.querySelectorAll(".dropdownbox").forEach(function (d, i) {
        //temp += "<tr><th scope=\"row\">"+(i+1)+"</th><td>"+d.innerText.trim()+"</td></tr>"
        arr.push(d.innerText.trim())
    });
    var temp = ""
    arr.sort().forEach(function (d, i) {
        temp += "<tr><th scope=\"row\">" + (i + 1) + "</th><td>" + d + "</td></tr>"
    });
    $("#listTable > tbody").append(temp);
})


$('#exampleModal').on('shown.bs.modal', function (e) {
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

function getDefinition() {
    //The term we want the definition of is in var right_clicked
    document.getElementById('book_loader').style.display = 'block';
    let modal_body = document.getElementById('definitionModal').querySelector('.modal-body');
    setTimeout(function () {
        get_definition(right_clicked).done(function (d) {
            document.getElementById('book_loader').style.display = 'none';
            modal_body.innerHTML = d
        });
    }, 3000);
}

function get_definition(text) {
    // return $.ajax({
    //     type: "GET",
    // url: " getTaggedWords/",
    // data: {'id': poemID},
    // dataType: "json",
    // });

};

let second_term = ""
let merging = false
let full_term = ""

function merge_term(obj, event){
     event.preventDefault()
     if(selected_obj == ""){
         window.alert("To merge ,First you need to select a term")
         second_term = ""
         return
     }
     if(merging == true){
        window.alert("you already merged two terms , reclick on the first term or any other to reset")
        return
     }
     const first_term_properties = selected_obj.attr('id').split('_').map(x => +x)
     const second_term_properties = second_term.attr('id').split('_').map(x => +x)
     if(first_term_properties[0] != second_term_properties[0] || second_term_properties[2]!=1 || second_term_properties[1] === first_term_properties[1] ||
             selected_obj[0].parentNode.getElementsByTagName("span").length != first_term_properties[2]){
                window.alert("you cant merge this two terms")
                return;
      }
     merging = true
     reset();
     second_term[0].style.color = "orange"
     full_term = selected_obj[0].innerHTML.trim()+second_term[0].innerHTML.trim()
     term_current_tags();
     load_suggestions(full_term);
}
