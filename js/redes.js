function openDialog(id){
  const dialog = document.getElementById(id);
  if(dialog && typeof dialog.showModal === "function"){
    dialog.showModal();
  }
}

function closeDialog(id){
  const dialog = document.getElementById(id);
  if(dialog && dialog.open){
    dialog.close();
  }
}
