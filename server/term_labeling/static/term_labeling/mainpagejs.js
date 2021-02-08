
// ################################ global parameters ################################

let selected_term = ""; // the clicked term name by
let selected_obj = ""; // the clicked term obj in html
let right_clicked = ""; //The term we right clicked and open a menu for - the term we need the definition of
let right_clicked_line = 0; //The line of the right clicked term
let orange = "rgb(255, 165, 0)";
let tagParent = ""; // the selected tag in the hierarchy
let depth = 0;     // our current depth in the hierarchy , default is 0 when only roots are shown
let all_tags = []; // all tags in the db.
let viz;  // object to present the graph in currents tags of current poem
let poemID; // this poem id
let myUL;  // search bar ul
let tagged_terms_list; // all tagged terms in this poem
let suggested_term_list; // all terms that have a suggestion tags in this poem
let allroots; // all roots for all words
let table  // table object
let Excel // all tags in current poem to be used to download as excel file.
let ul1; // second layer of the hierarchy tree
let ul2; // third layer of the hierarchy
let rightclicked = ""; // right clicked tag from the hierarchy
let second_term = ""; // second term for merging terms
let merging = false; // in case merging is true or merging is false , default false.
let full_term = ""; // full term of two merging terms ,a + b = ab
let flag = false ; //flag false mean we're not returning to all roots , true mean w'ere returning to all roots if the tag have no parent

// ################################ end of parameters section ################################

$(document).ready(function () {
/*
only when document ready , do all required functions.
*/
    // get all roots
    getHeaders();
    // get poem_id
    const obj = document.getElementById("poem_id");
    poemID = obj.innerText;
    obj.remove();
    myUL = document.getElementById('myUL');
    $(document).click(function (e) {
            // on document click check if tags search bar is open and close it
        if ($('#tagsDropDown').is(':visible') && e.target.id !== "mySearchInput" && e.target.className !== "dropdownbox") {
            $('#tagsDropDown').hide();
        }
    });
    get_words_analyzation(poemID).done(function (d) {
        // analyze the poem words and color it using this rules , green for a tagged term , blue for suggested term
        tagged_terms_list = d.tagged;
        suggested_term_list = d.suggested;
        tagged_terms_list.forEach(function (d) {
            const id = d.row + "_" + d.sader + "_" + d.position;
            document.getElementById(id).style.color = "green"
        });
        suggested_term_list.forEach(function (d) {
            if (!tagged_terms_list.some(item => item.row === d.row && item.sader === d.sader && item.position === d.position)) {
                const id = d.row + "_" + d.sader + "_" + d.position;
                document.getElementById(id).style.color = "blue"
            }
        });
        allroots = d.roots;
        tooltips = $('.term').tooltip();
        // add tooltip for each term that's show the root
        tooltips.each(function (ndx, elem) {
            $(elem).attr('title', allroots[elem.innerHTML.trim()])
                .tooltip('_fixTitle')
        })
    });
    $("#collapseOne").collapse('hide');
    $("#collapseThree").collapse('show');
    // init table for all tags
    table = $('#TaglistTable').DataTable( {
        responsive: true,
         columns: [
            { title: "#" },
            { title: "Tag" },
            { title: "Frequency" },
            { title: "Percent of Total" },
        ]
    } );
        // tooltip for each button
       $('.btn').tooltip({
            trigger:'hover'
        });
    $(".term").click(function () {
        //when client click on a term , check prev clicked term and adjust its color
        if (selected_obj !== "" && selected_obj.css("color") === orange) {
            const properties = selected_obj.attr('id').split('_').map(x => +x);
            if (tagged_terms_list.some(item => item.row === properties[0] && item.sader === properties[1] && item.position === properties[2])) {
                selected_obj[0].style.color = "green"
            } else if (suggested_term_list.some(item => item.row === properties[0] && item.sader === properties[1] && item.position === properties[2])) {
                selected_obj[0].style.color = "blue"
            } else {
                selected_obj[0].style.color = "black"
            }
        }
        // check if a merging between 2 terms existed before and adjust the second term color
        if (second_term !== ""){
              const properties = second_term.attr('id').split('_').map(x => +x);
            if (tagged_terms_list.some(item => item.row === properties[0] && item.sader === properties[1] && item.position === properties[2])) {
                second_term[0].style.color = "green"
            } else if (suggested_term_list.some(item => item.row === properties[0] && item.sader === properties[1] && item.position === properties[2])) {
                second_term[0].style.color = "blue"
            } else {
                second_term[0].style.color = "black"
            }}
         // clear some prev parameters
        second_term = "";
        full_term = "";
        merging = false;
        reset();
        // this clicked term to orange color
        $(this).css("color", "orange");
        selected_obj = $(this);
        selected_term = this.innerHTML;
        // load term current tags and suggestions
        term_current_tags(selected_term);
        load_suggestions(selected_term);
    }).bind('contextmenu', function (e) {// disable right click and show custom context menu
        right_clicked = this.innerHTML;
        right_clicked_line = this.id.split("_")[0];
        if (merging === false)
            second_term = $(this);
        close_open_windows();
        const windowHeight = $(window).height() + $(window).scrollTop();
        const top = e.pageY + 5;
        const left = e.pageX;
        const menuHeight = $(".term-menu").outerHeight();
        let y = top;
        if (windowHeight < menuHeight + top) {
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
    // when clicking on current tags buttons , show first tab
     $('#exampleModal').on('shown.bs.modal', function (e) {
        $('a[href=\\#graph]').tab('show')
        load_graph()
     });
     // when clicking on show all tags button
    $('#showAllModal').on('shown.bs.modal', function (e) {
        const src = document.getElementById("listTable");
        while (src.lastChild.id !== 'Fchild') {
            src.removeChild(src.lastChild);
        }
        src.innerHTML += "<tbody></tbody>";
        const arr = [];
        document.querySelectorAll(".dropdownbox").forEach(function (d, i) {
            //temp += "<tr><th scope=\"row\">"+(i+1)+"</th><td>"+d.innerText.trim()+"</td></tr>"
            arr.push(d.innerText.trim())
        });
        let temp = "";
        arr.sort().forEach(function (d, i) {
            let tt = "close_modal('#showAllModal');searchSuggestion(this.innerHTML);";
            temp += "<tr><th scope=\"row\">" + (i + 1) + "</th><td class='show_all_tag' onclick=" + tt + ">" + d + "</td></tr>"
        });
        $("#listTable > tbody").append(temp);
    });
    // when clicking on second tab of #examplemodal
    $('a[href=\\#list]').on('shown.bs.tab', function (e) {
        table.clear().draw()
        load_tags_freq().done(function(d){
            data = d.tags
            Excel = []
            Excel.push(["#","Term","Frequency","Percent Of Total"])
            data.forEach(function(l , i){
                 let percent = (l.Tag.frequency/d.total*100).toFixed(2)+"%"
                 r = [i+1,l.Tag.name,l.Tag.frequency,percent]
                 table.row.add(r).draw()
                 Excel.push(r)
             });
        });
    });

});


function close_open_windows() {
    // hide visible custom menus
    if ($('#tag-menu').is(':visible')) {
        $('#tag-menu').hide();
    }
    if ($('#term-menu').is(':visible')) {
        $('#term-menu').hide();
    }
}

function loadTags() {
    //load all tags from db
    getAllTags().done(function (d) {
        all_tags = d.tags;
        update_tags_list()
    });
}

function update_tags_list() {
    // add all tags to search bar
    myUL.innerHTML = "";
    all_tags.forEach(function (idx, li) {
        myUL.innerHTML += "<li><a href=\"javascript:void(0)\" id=" + idx + " onclick=\"searchTag(this)\">" + idx + "</a></li>";
    });
}


function filterSearch() {
    // when searching in searchbar , filter the result
    $('#tagsDropDown').show();
    let input, filter, ul, li, a, i, txtValue;
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



// ################################  ajax calls section ################################

function load_tags_freq() {
    return $.ajax({
        type: "GET",
        url: " get_Tags_frequency_in_poem/",
        data: {'id': poemID},
        dataType: "json",
    });
}

function get_words_analyzation(text) {
    return $.ajax({
        type: "GET",
        url: " get_words_analyzation/",
        data: {'id': poemID},
        dataType: "json",
    });
}

function getRootofWord(text) {
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
    let t = selected_term;
    if (merging === true)
        t = full_term;
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
            const roots = data.roots;
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

function save_term_tag(tag) {
    const term_id = selected_obj.attr('id').split('_');
    let t = selected_term;
    if (merging === true)
        t = full_term;

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
            if (suggestions === undefined || suggestions.length === 0) {
                $("#collapseTwo").collapse("hide")
                document.getElementById('All_suggestions').style.display = 'none';
            } else {
                suggestions.forEach(build_suggestion);
                if(suggestions.length>1)
                    document.getElementById('All_suggestions').style.display = 'flex';
                else document.getElementById('All_suggestions').style.display = 'none';
                $("#collapseTwo").collapse("show")
            }
        }
    });
}

function term_current_tags(term) {
    const term_id = selected_obj.attr('id').split('_');
    $.ajax({
        type: "GET",
        url: "term_current_tags/",
        data: {
            'row': term_id[0],
            'place': term_id[1],
            'position': term_id[2],
            'id': poemID,
            'term': term,
        },
        dataType: "json",
        success: function (data) {
            if (data.tags === undefined || data.tags.length === 0) {
                $("#collapseOne").collapse("hide")

            } else {
                const tags_term = data.tags.map(a => a.tag);
                tags_term.forEach(build_tag);
                $("#collapseOne").collapse("show")
            }
        }
    });
}

function add_all_suggestions_ajax(keys ,term_id){
    let t = selected_term;
    if (merging === true)
        t = full_term;
    return $.ajax({
        type: "GET",
        url: "add_all_suggestions/",
        data: {
            'row': term_id[0],
            'place': term_id[1],
            'position': term_id[2],
            'term': t,
            'tags[]':keys,
            'id': poemID,
        }
    });
}



//  ################################ end of ajax calls. ################################


//  ################################ tree view section #######################################
function change_parent() {
    // change parent of tag in the hierarchy.
    text = document.getElementById("change-parent").value;
    if (text === "") {
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
            document.getElementById("change-parent").value = "";
            search2(rightclicked);
            $('#changeParentModal').modal('hide')
        });
    }
}

function delete_tag() {
    // delete tag from the hierarchy
    getParent(rightclicked).done(function (d) {
        const parent = d.parent;
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
    // delete tag and all of its children.
    getParent(rightclicked).done(function (d) {
        const parent = d.parent;
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
    // add new parent for tag in the hierarchy.
    text = document.getElementById("parent-name").value;
    if (text === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "The field is empty ,Please insert a tag before clicking";
        timeout();
    }
    else {
        if (text === rightclicked) {
            window.alert("Error , you can`t add the term itself as parent");
            return
        }
        add_parent(rightclicked, text).done(function (d) {
            if (d.add === false) {
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
    // edit tag name in the hierarchy
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
    // add new child for tag in the hierarchy
    text = document.getElementById("child-name").value;
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
    // add new root in the hierarchy
    const text = document.getElementById("root-name").value;
    if (text === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "The field is empty ,Please insert a tag before clicking";
        timeout();
    }
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
    // close current open modal by its id.
    $(id).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

function emptyTree() {
    // clear all tags in the hierarchy by clearing its first , second and third layer.
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

/*
#for hierarchy view there is 3 layers , parent -> clicked tag -> children .
    parent are first layer , clicked tag is second layer , children are third layer
#when there is no parent , that's mean the selected tag without parent , so only 2 layers are left , tag --> children
    tag are first layer , children are second layer
# when no parent and children there is only 1 layer and that's is the selected tag
*/

function item_clicked1(obj, event) {
    //clicking on parent element of the selected tag , that's also mean were going back in the hierarchy
    event.stopPropagation();
    close_open_windows();
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
    //clicking on the selected tag . can be used for refresh or to dected if the clicking term have no parent and were going back to show all roots.
    event.stopPropagation();
    close_open_windows();
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
    //clicking on tags children ,that's also mean were advancing in the hierarchy .in addition when roots are only shown they are treated as a child element
    event.stopPropagation();
    close_open_windows();
    const elem = $(obj);
    const text = elem[0].textContent.split(/\r?\n/)[0];
    depth = depth + 1;
    emptyTree();
    if (depth === 1)
        flag = false;
    item_clicked(text);
}

function item_clicked(text) {
    // create tree for the selected tag , first create parent , second create selected tag , third create children tags
    tagParent = text;
    const ul = document.querySelector('.tree');
    getParent(text).done(function (data) {
        const parent = data.parent;
        if (parent.length === 0 && flag === true) {
            // in case we're going back to all roots
            getHeaders();
            depth = 0;
            tagParent = "";
            flag = false;
            return;
        }
        const current = document.createElement("il");
        if (parent.length > 0) {
            // if parent exist , create parent element
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
    // build children tag elements in the hierarchy
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item.child.name));
    li.setAttribute('onclick', "item_clicked3(this, event)");
    li.setAttribute('oncontextmenu', 'right_click_tag(this, event)');
    li.setAttribute('class', "child");
    li.setAttribute("style", "color: black");
    ul2.appendChild(li);
}

function build_il_headers(item, index) {
    // build roots tag elements in the hierarchy
    const ul = document.querySelector('.tree');
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item.root.name));
    li.setAttribute('onclick', "item_clicked3(this,event)");
    li.setAttribute('oncontextmenu', 'right_click_tag(this, event)');
    li.setAttribute('class', "child");
    ul.appendChild(li);
}

function right_click_tag(obj, e) {
    // when clicking on tag , show the custom menu.
    e.stopPropagation();
    //prevent default menu
    e.preventDefault();

    const text = obj.innerText.split(/\r?\n/)[0];
    if (e.target !== obj)
        return;
    //save the tag name that's was clicked
    rightclicked = text;
    close_open_windows();
    const windowHeight = $(window).height() + $(window).scrollTop();
    const windowWidth = $(window).width() + $(window).scrollLeft();
    const top = e.pageY + 5;
    const left = e.pageX;
    const menuHeight = $(".tag-menu").outerHeight();
    const menuwidth = $(".tag-menu").outerWidth();
    // Show contextmenu
    let x = left;
    let y = top;
    if (windowHeight < top + menuHeight) {
        y = windowHeight - menuHeight - 5
    }
    if (windowWidth < left + menuwidth) {
        x = left - menuwidth - 5
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


// ################################ end of tree view section ################################


// ################################ containers section ################################

function remove_tag_in_selected(obj) {
    // remove tag from the term selected tags
    const elem = $(obj);
    const btn = elem[0].getElementsByClassName("btn-txt");
    const text = btn[0].innerHTML;
    let term_id = selected_obj.attr('id').split('_');
    remove_tag_from_word(text, term_id).done(function (d) {
        if(d.exist === true && d.last === true) {
            term_id = term_id.map(x => +x);
            tagged_terms_list = tagged_terms_list.filter(function (value, index, arr) {
                if(value.position == term_id[2] && value.row == term_id[0] && value.sader == term_id[1])
                    return false;
                else return true;
            });
            $("#collapseOne").collapse("hide")
        }
        elem.remove();
    });
}

function add_tag_to_selected(obj, e) {
    // add tag from hierarchy to the clicked term
    event.stopPropagation();
    //prevent default menu
    e.preventDefault();
    if (merging === false && selected_term === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "First you need to choose a term";
        timeout();

    } else {
        save_term_tag(rightclicked).done(function (d) {
            if (d === "Success") {
                const term_id = selected_obj.attr('id').split('_').map(x => +x);
                if (!tagged_terms_list.some(item => item.row === d.row && item.sader === d.sader && item.position === d.position)) {
                    // in case that was the last tag for the clicked term , remove it from tagged term file.
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

function btn_add_all_suggestions(){
    // add all suggestion from contrainer to the selected word.
    const dict = {}
    const keys = []
    document.getElementsByClassName("suggested_container")[0].childNodes.forEach(function(d){
        if(d.className.includes("btn")){
            const text = d.getElementsByClassName("btn-txt");
            const tag_text = text[0].innerText.slice(0, text[0].innerText.lastIndexOf("-"));
            keys.push(tag_text)
            dict[tag_text] = d
        }
    })
    let term_id = selected_obj.attr('id').split('_');
    add_all_suggestions_ajax(keys,term_id).done(function(data){
       term_id = term_id.map(x=>+x)
       for (const d in data){
            if(data[d] === true){
                if (!tagged_terms_list.some(item => item.row === term_id[0] && item.sader === term_id[1] && item.position === term_id[2])) {
                     tagged_terms_list.push({position: term_id[2], row: term_id[0], sader: term_id[1]});
                }
                build_tag(d);
                dict[d].remove()
            }
       }
       $("#collapseOne").collapse("show");
       if ($('.suggested_container').children().length === 0) {
           $("#collapseTwo").collapse("hide")
           document.getElementById('All_suggestions').style.display = 'none';
       }
       if ($('.suggested_container').children().length == 1) {
           document.getElementById('All_suggestions').style.display = 'none';
       }
    });
}


function add_tag(obj) {
    // add new tag to the selected word from the the suggestion window.
    const text = obj.getElementsByClassName("btn-txt");
    const tag_text = text[0].innerText.slice(0, text[0].innerText.lastIndexOf("-"));
    save_term_tag(tag_text).done(function (d) {
        if (d === "Success") {
            // add the term to the current tagged terms
            const term_id = selected_obj.attr('id').split('_').map(x => +x);
            if (!tagged_terms_list.some(item => item.row === d.row && item.sader === d.sader && item.position === d.position)) {
                tagged_terms_list.push({position: term_id[2], row: term_id[0], sader: term_id[1]});
            }
            build_tag(tag_text);
            $("#collapseOne").collapse("show");
            obj.remove();
            if ($('.suggested_container').children().length === 0) {
                $("#collapseTwo").collapse("hide")
            }
            if ($('.suggested_container').children().length == 1) {
                document.getElementById('All_suggestions').style.display = 'none';
            }
        } else {
            window.alert("something went wrong, click again on the term")
        }
    });
}

function build_tag(tag_name) {
    // build tag element in the selected tags window for the selected term.
    const container = document.getElementsByClassName('selected_container')[0];
    container.insertAdjacentHTML('beforeend', '<button class="btn btn-sm tag-btn" onclick="remove_tag_in_selected(this)">\n' +
        '                    <i class=\'fa fa-minus\'></i>' + '&nbsp;' +
        '                    <span class="btn-txt">' + tag_name + '</span>\n' +
        '                </button>')

}

function build_suggestion(item, index) {
    // build suggestion tag element win suggestion window for the selected term.
    const container = document.getElementsByClassName('suggested_container')[0];
    container.insertAdjacentHTML('beforeend', '<button class="btn btn-sm tag-btn" onclick="add_tag(this)"> \n' +
        '                   <i class=\'fa fa-plus\'></i>' + '&nbsp;' +
        '                    <span class="btn-txt">' + item[0] + '-' + parseFloat(item[1].toFixed(4)) + '</span>\n' +
        '                </button>');

}

// ################################ end of containers section ################################

function reset() {
    // clear containers
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

function timeout() {
    setTimeout(function () {
        $("#myToast").fadeOut().attr('class', 'toast danger_toast');
    }, 2500);
}


function searchSuggestion(text) {
    // search for word and present it in the hierarchy
    getDepth(text).done(function (d) {
        depth = d.depth + 1;
        emptyTree();
        if (depth === 1)
            flag = false;
        item_clicked(text);
    });
}

function refreshVis() {
    // refresh graph
    viz.reload()
}

function Convert_to_Png(e) {
      // convert graph to png for download
     const canvas = document.getElementById("viz").getElementsByTagName("canvas")[0]
     can = canvas.toDataURL()
     let link = document.createElement("a")
     link.href = can
     link.download = 'Graph'
     link.click()
}

function search2(text) {
    // search for tag in the hierarchy when text is given
    getDepth(text).done(function (d) {
        depth = d.depth + 1;
        emptyTree();
        if (depth === 1)
            flag = false;
        item_clicked(text);
    });
}

function searchTag(obj) {
    //search for rag in the hierarchy when obj is given
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

function back_home() {
    // back to all roots in the hierarchy
    emptyTree();
    getHeaders();
    depth = 0;
    tagParent = "";
    flag = false;
}

function load_graph () {
        //create graph to show all tags in poem
        statement = "match p=()-[r:tag{poemID:'$'}]->() RETURN p".replace('$', poemID);
        var config = {
            container_id: "viz",
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "123123147",
            labels: {
                "Tag": {
                    "caption": "name",
                    "title_properties": [
                        "name"
                    ]
                },
                "Word": {
                    "caption": "name",
                    "title_properties": [
                        "name"
                    ]
                }
            },
            relationships: {
                "tag": {
                    "caption": false
                }
            },
            arrows: true,
            initial_cypher: statement
        };
        viz = new NeoVis.default(config);
        viz.render();
}



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
}

function buildLine() {
    const tbl = document.getElementById('poem');
    const row = tbl.rows[right_clicked_line - 1];
    document.getElementById('edited-sadr').value = row_to_string(row.cells[1]);
    document.getElementById('edited-ajuz').value = row_to_string(row.cells[2]);
}

function row_to_string(cell) {
    let line = "";
    const children = cell.children;
    for (let i = 0; i < children.length; i++) {
        line += children[i].innerHTML;
    }
    return line
}

function save_edited_line() {
    const sadr = document.getElementById('edited-sadr').value;
    const ajuz = document.getElementById('edited-ajuz').value;
    //TODO finish the actual saving part
    $.ajax({
        type: "GET",
        url: "edit_poem_line/",
        data: {
            'sadr': sadr,
            'ajuz': ajuz,
            'line': right_clicked_line - 1,
            'id': poemID
        },
        dataType: "json",
        success: function (data) {
            //close modal and toast success message
            // maybe reload the page with the updated line ?
        }
    });
}

function merge_term(obj, event) {
    // when merging 2 terms
    event.preventDefault();
    // need to click on term first to merge with another
    if (selected_obj === "") {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "To merge ,First you need to select a term";
        timeout();
        second_term = "";
        return
    }
    // merging when its already a merging mode
    if (merging === true) {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "you already merged two terms , reclick on the first term or any other to reset";
        timeout();
        return
    }
    const first_term_properties = selected_obj.attr('id').split('_').map(x => +x);
    const second_term_properties = second_term.attr('id').split('_').map(x => +x);
    if (first_term_properties[0] != second_term_properties[0] || second_term_properties[2] != 1 || second_term_properties[1] <= first_term_properties[1] ||
        selected_obj[0].parentNode.getElementsByTagName("span").length != first_term_properties[2]) {
        $("#myToast").attr("class", "toast show danger_toast").fadeIn();
        document.getElementById("toast-body").innerHTML = "you cant merge this two terms";
        timeout();
        return;
    }
    merging = true;
    reset();
    second_term[0].style.color = "orange";
    full_term = selected_obj[0].innerHTML.trim() + second_term[0].innerHTML.trim();
    term_current_tags(full_term);
    load_suggestions(full_term);
}

function ConvertToExcel(){
    // create downloadable excel file.
    if(typeof Excel === 'undefined') {
        return
     }
    const array = XLSX.utils.aoa_to_sheet(Excel)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, array, 'Tags Frequency')
    XLSX.writeFile(wb, 'Tags Frequency.xlsx')

}