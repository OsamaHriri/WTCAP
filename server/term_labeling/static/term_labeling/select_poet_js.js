/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
let poemid = 2066;

function myFunction(id) {
    document.getElementById(id).classList.toggle("show");
    /*
    if (id === 'poetDropDown') {
        resetPoems();
    }*/
}

function resetPoems() {
    //remove all poems
    $(".poems-link").each(function () {
        this.remove();
    });
    const js_list = "{{poems}}";
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

document.addEventListener('DOMContentLoaded', function () {
    window.setTimeout(document.querySelector('svg').classList.add('animated'), 1000);
});