function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2300);
}

async function copyText(text,message){
  try{
    await navigator.clipboard.writeText(text);
  }catch(error){
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast(message);
}

function openYape(){
  copyText("956589548","Número Yape copiado");
  window.setTimeout(() => window.location.href = "yape://", 350);
}

function openBBVA(){
  copyText("942180159","Número Plin copiado. Intentando abrir BBVA...");
  window.setTimeout(() => window.location.href = "bbva://", 400);
}
