/*
this js file to handle the home page.
 */

$(document).ready(function () {
     $('#myinfo').on('shown.bs.modal', function (e) {
            modal = document.getElementById("myinfo")
            body = modal.getElementsByClassName('modal-body')[0];
            body.innerHTML = "<h3 style=\"text-align:center;\">Welcome to WTCAP</h3><br><ul><li>Use the Menubar to move between pages.</li><li> Guests have restriction ,Please contact the owner for more details.</li>"
            +"<li>Click on history icon to show your previous accessed poems.</li></ul>"
     });
});