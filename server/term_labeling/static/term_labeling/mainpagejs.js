function toggle(source) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] !== source)
            checkboxes[i].checked = source.checked;
    }
}

function ul(index) {
    const underlines = document.querySelectorAll(".underline");
    for (let i = 0; i < underlines.length; i++) {
        underlines[i].style.transform = 'translate3d(-' + index * 100 + '%,0,0)';
    }
}

function boxchecked(obj, val) {
    const id = obj.id;
    const tblrow = document.getElementById("row" + val);
    if (obj.checked) {
        const newel = document.createElement('td');
        const element_id = document.getElementsByTagName("td").length;
        newel.setAttribute('id', element_id);
        newel.innerHTML = "<input type='submit' value=' حلّل '>"
        tblrow.appendChild(newel);
    }
    if (!obj.checked) {
        const x = tblrow.length;
        const tdre = tblrow[x];
        tblrow.removeChild(tdre)
    }
}