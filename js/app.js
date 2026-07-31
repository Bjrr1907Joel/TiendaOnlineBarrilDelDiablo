document.addEventListener("DOMContentLoaded", () => {
  renderDrinks();

  document.getElementById("btnYape").addEventListener("click", openYape);
  document.getElementById("btnPlin").addEventListener("click", () => openDialog("modalPlin"));
  document.getElementById("btnRedes").addEventListener("click", () => openDialog("modalRedes"));
  document.getElementById("btnTragos").addEventListener("click", () => openDialog("modalTragos"));
  document.getElementById("btnBBVA").addEventListener("click", openBBVA);
  document.getElementById("btnCopiarPlin").addEventListener("click", () => {
    copyText("942180159","Número Plin copiado");
  });

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => closeDialog(button.dataset.close));
  });

  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
