const drinks = [
  ["machu-picchu","Machu Picchu"],
  ["cuba-libre","Cuba Libre"],
  ["blue-hawaiian","Blue Hawaiian"],
  ["margarita","Margarita"],
  ["blue-margarita","Blue Margarita"],
  ["pina-colada","Piña Colada"],
  ["daiquiri","Daiquiri"],
  ["mojito","Mojito"],
  ["caipirinha","Caipirinha"],
  ["laguna-azul","Laguna Azul"],
  ["chilcano","Chilcano"],
  ["mojito-frutos-rojos","Mojito de frutos rojos"],
  ["chilcano-maracuya","Chilcano de maracuyá"],
  ["pisco-sour","Pisco Sour"]
];

function renderDrinks(){
  const grid = document.getElementById("drinkGrid");
  grid.innerHTML = drinks.map(([slug,name]) => `
    <article class="drink">
      <img src="img/tragos/${slug}.svg" alt="${name}" loading="lazy">
      <strong>${name}</strong>
    </article>
  `).join("");
}
