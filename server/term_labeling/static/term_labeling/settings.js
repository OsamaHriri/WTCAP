/*
this js file to handle the settings page.
 */

function toggle_body(id) {
    // show/hide tab by id
  const header = document.getElementById(id);
  const body = header.nextElementSibling;
  $(body).toggle();
}