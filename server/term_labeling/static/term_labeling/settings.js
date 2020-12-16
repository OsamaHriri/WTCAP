function toggle_body(id) {
  const header = document.getElementById(id);
  const body = header.nextElementSibling;
  $(body).toggle();
}