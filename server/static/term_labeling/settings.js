function toggle_body(id) {
  const header = document.getElementById(id);
  const body = header.nextElementSibling;
  $(body).toggle();
}


function sync_database(){
  return $.ajax({
        type: "POST",
        url: "sync_databases/"
    });

}