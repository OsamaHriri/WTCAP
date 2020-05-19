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

let selected = [];
function box_checked(obj) {
    const id = obj.id;
    const ok = document.getElementById(id);
    let button = document.getElementById("submit-button");
    const position = ok.getBoundingClientRect();
    const y = position.left + window.scrollX + 30;
    const x = position.top + window.scrollY - 8;
    button.style.left = y + "px";
    button.style.top = x + "px";
}

function idk(){
    const tbl = document.getElementById('selected-table')
    for(let i=0; i<tbl.rows.length; i++){
        tbl.rows[i].onclick = function(){
            rindex = this.rowIndex;
            window.alert(rindex);
        }
    }
}
