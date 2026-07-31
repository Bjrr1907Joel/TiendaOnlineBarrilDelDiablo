const CART_KEY="barril_diablo_cart_v2";
const FAVORITES_KEY="barril_diablo_favorites_v2";
let cart=JSON.parse(localStorage.getItem(CART_KEY)||"{}");
let favorites=new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)||"[]"));
let favoritesOnly=false;

const grid=document.getElementById("productGrid");
const search=document.getElementById("search");
const category=document.getElementById("category");
const cartModal=document.getElementById("cartModal");

const CATEGORY_IMAGES={
  "Aguardiente":"aguardiente.png","Aguas":"aguas.png","Cervezas":"cervezas.png",
  "Cigarros":"cigarros.png","Cócteles":"cocteles.png","Cremas y licores":"cremas-y-licores.png",
  "Gaseosas":"gaseosas.png","Jarabes e insumos":"jarabes-e-insumos.png","Otros":"otros.png",
  "Pisco":"pisco.png","Ron":"ron.png","Snacks":"snacks.png","Tequila":"tequila.png",
  "Vinos":"vinos.png","Vodka":"vodka.png","Whisky":"whisky.png"
};

function toast(m){const e=document.getElementById("toast");e.textContent=m;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800)}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCount();renderSuggestions()}
function saveFavorites(){localStorage.setItem(FAVORITES_KEY,JSON.stringify([...favorites]))}
function updateCount(){const t=Object.values(cart).reduce((s,i)=>s+i.cantidad,0);document.getElementById("cartCount").textContent=t;document.getElementById("floatingCount").textContent=t}
function fallbackImage(img,product){img.onerror=null;img.src=product.imagenDefault||"img/default/producto.png"}

function loadCategories(){
  const cats=[...new Set(PRODUCTOS.map(p=>p.categoria))].sort();
  cats.forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;category.appendChild(o)});
  document.getElementById("categoryGrid").innerHTML=cats.map(c=>`
    <button class="category-card" data-category="${c}">
      <img src="img/categorias/${CATEGORY_IMAGES[c]||"otros.png"}" alt="${c}">
      <strong>${c}</strong>
    </button>`).join("");
  document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{
    category.value=btn.dataset.category;
    favoritesOnly=false;
    document.getElementById("showFavorites").classList.remove("active");
    document.getElementById("productsTitle").textContent=btn.dataset.category;
    renderProducts();
    document.getElementById("productGrid").scrollIntoView({behavior:"smooth"});
  }));
}

function productCard(p){
  return `<article class="product">
    <div class="product-image-wrap">
      <img class="product-image" src="${p.imagen}" alt="${p.nombre}" loading="lazy"
           onerror='fallbackImage(this,${JSON.stringify(p).replace(/'/g,"&#39;")})'>
    </div>
    <span class="badge">${p.categoria}</span>
    <h3>${p.nombre}</h3>
    <small>${p.unidad}</small>
    <div class="product-actions">
      <button class="favorite ${favorites.has(p.codigo)?"active":""}" data-fav="${p.codigo}" aria-label="Favorito">${favorites.has(p.codigo)?"♥":"♡"}</button>
      <button class="add" data-code="${p.codigo}">Agregar</button>
    </div>
  </article>`;
}

function bindCards(container){
  container.querySelectorAll(".add").forEach(b=>b.addEventListener("click",()=>{
    const p=PRODUCTOS.find(x=>x.codigo===b.dataset.code);
    if(!cart[p.codigo])cart[p.codigo]={...p,cantidad:0};
    cart[p.codigo].cantidad++;
    saveCart();toast("Producto agregado");
  }));
  container.querySelectorAll(".favorite").forEach(b=>b.addEventListener("click",()=>{
    if(favorites.has(b.dataset.fav))favorites.delete(b.dataset.fav);else favorites.add(b.dataset.fav);
    saveFavorites();renderProducts();
  }));
}

function renderProducts(){
  const q=search.value.trim().toLowerCase(),cat=category.value;
  const filtered=PRODUCTOS.filter(p=>
    (!cat||p.categoria===cat)&&
    (!favoritesOnly||favorites.has(p.codigo))&&
    (!q||p.nombre.toLowerCase().includes(q)||p.codigo.includes(q))
  );
  grid.innerHTML=filtered.map(productCard).join("")||'<p class="empty">No se encontraron productos.</p>';
  bindCards(grid);
}

function suggestionCategories(){
  const cats=new Set(Object.values(cart).map(i=>i.categoria));
  const wanted=new Set();
  if(cats.has("Whisky"))["Gaseosas","Aguas","Snacks","Jarabes e insumos"].forEach(x=>wanted.add(x));
  if(cats.has("Ron"))["Gaseosas","Aguas","Jarabes e insumos"].forEach(x=>wanted.add(x));
  if(cats.has("Pisco"))["Gaseosas","Jarabes e insumos","Aguas"].forEach(x=>wanted.add(x));
  if(cats.has("Tequila"))["Jarabes e insumos","Aguas"].forEach(x=>wanted.add(x));
  if(cats.has("Cervezas"))["Snacks","Cigarros"].forEach(x=>wanted.add(x));
  return wanted;
}

function renderSuggestions(){
  const cats=suggestionCategories();
  const section=document.getElementById("suggestionsSection");
  if(!cats.size){section.classList.add("hidden");return}
  const inCart=new Set(Object.keys(cart));
  const suggestions=PRODUCTOS.filter(p=>cats.has(p.categoria)&&!inCart.has(p.codigo)).slice(0,8);
  if(!suggestions.length){section.classList.add("hidden");return}
  const sg=document.getElementById("suggestionsGrid");
  sg.innerHTML=suggestions.map(productCard).join("");
  bindCards(sg);section.classList.remove("hidden");
}

function changeQty(c,d){if(!cart[c])return;cart[c].cantidad+=d;if(cart[c].cantidad<=0)delete cart[c];saveCart();renderCart()}
function renderCart(){
  const items=Object.values(cart),box=document.getElementById("cartItems");
  if(!items.length){box.innerHTML='<p class="empty">Tu carrito está vacío.</p>';return}
  box.innerHTML=items.map(i=>`<div class="cart-row">
    <img src="${i.imagen}" onerror="this.onerror=null;this.src='${i.imagenDefault}'" alt="">
    <div><strong>${i.nombre}</strong><br><small>${i.unidad}</small></div>
    <div class="qty"><button data-a="minus" data-c="${i.codigo}">−</button><b>${i.cantidad}</b><button data-a="plus" data-c="${i.codigo}">+</button><button class="remove" data-a="remove" data-c="${i.codigo}">×</button></div>
  </div>`).join("");
  box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.a==="plus")changeQty(b.dataset.c,1);
    if(b.dataset.a==="minus")changeQty(b.dataset.c,-1);
    if(b.dataset.a==="remove"){delete cart[b.dataset.c];saveCart();renderCart()}
  }));
}
function openCart(){renderCart();cartModal.showModal()}
function sendWhatsapp(){
  const items=Object.values(cart);if(!items.length){toast("Agrega productos primero");return}
  const entrega=document.querySelector('input[name="entrega"]:checked').value;
  const name=document.getElementById("customerName").value.trim();
  const notes=document.getElementById("notes").value.trim();
  const grouped={};items.forEach(i=>(grouped[i.categoria]??=[]).push(i));
  let lines=[];
  Object.entries(grouped).forEach(([cat,list])=>{
    lines.push(`\n*${cat.toUpperCase()}*`);
    list.forEach(i=>lines.push(`• ${i.cantidad} x ${i.nombre}`));
  });
  let msg=`Hola, El Barril del Diablo.\n\nDeseo realizar el siguiente pedido:${lines.join("\n")}\n\n*Modalidad:* ${entrega}`;
  if(name)msg+=`\n*Cliente:* ${name}`;
  if(notes)msg+=`\n*Indicaciones:* ${notes}`;
  msg+="\n\nPor favor, confirmen disponibilidad y el total del pedido.";
  window.open(`https://wa.me/51942180159?text=${encodeURIComponent(msg)}`,"_blank");
}

search.addEventListener("input",()=>{document.getElementById("productsTitle").textContent="Resultados";renderProducts()});
category.addEventListener("change",()=>{favoritesOnly=false;document.getElementById("showFavorites").classList.remove("active");document.getElementById("productsTitle").textContent=category.value||"Todos los productos";renderProducts()});
document.getElementById("showFavorites").addEventListener("click",e=>{favoritesOnly=!favoritesOnly;e.currentTarget.classList.toggle("active",favoritesOnly);document.getElementById("productsTitle").textContent=favoritesOnly?"Mis favoritos":(category.value||"Todos los productos");renderProducts()});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("floatingCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",()=>cartModal.close());
document.getElementById("clearCart").addEventListener("click",()=>{cart={};saveCart();renderCart()});
document.getElementById("sendWhatsapp").addEventListener("click",sendWhatsapp);

loadCategories();renderProducts();updateCount();renderSuggestions();
