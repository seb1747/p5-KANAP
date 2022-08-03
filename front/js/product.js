let idRecuperation = new URL(window.location.href).searchParams.get('id');
//recupération des paramètres ID depuis l'adresse URL
console.log(idRecuperation);

fetch("http://localhost:3000/api/products/" + idRecuperation)
  .then((response) => {
    if(response.ok) {
      response.json()
      .then((product) => { // insertion des éléments sur la page html 
        document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}" />`;
        document.getElementById("title").innerHTML = `${product.name}`;
        document.getElementById("price").innerHTML = `${product.price}`;
        document.getElementById("description").innerHTML = `${product.description}`;
        const colorChoice = product.colors;
        for (let color of colorChoice) {  
          document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`;
        };
      })
      .catch((error) => {
        alert ("produit indisponible")
});
    };
  })
  .catch((error) => {
    alert (" server non disponible")
  });

  // récupération élément du DOM 

  let addBasket = document.getElementById("addToCart");
  let color = document.getElementById("colors");
  let quantity = document.getElementById("quantity");

//----------------------------------------------------localStorage----------------------------------------------------------------------------------
// fonction d'initialisation du local storage
function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  }else{
    return JSON.parse(basket);
  }
};

// fonction d'ajout et de vérification même id même couleur

function addToBasket(productPicked) {
  let basket = getBasket();
  let findSameProduct = basket.find( product => product.id ==productPicked.id && product.color == productPicked.color);
  // si le produit existe déjà on ajoute la quantité 
  if (findSameProduct != undefined) {
    findSameProduct.quantity = parseInt(findSameProduct.quantity)+ parseInt(productPicked.quantity);
    if( findSameProduct.quantity > 100) {
      alert(" trop de produit dans le panier");
      findSameProduct.quantity = 100;
    }
  }
  // sinon on créé une nouvelle ligne dans le Array
  else {
    basket.push(productPicked);
  }
  saveBasket(basket);
  alert(" kanap ajouté au panier");
};
// function de sauvegarde du panier dans le localStorage
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
};

//----------------------------------------------------------------Ecoute du bouton ajout au panier --------------------------------------------------------

addBasket.addEventListener("click", (event) => {
  event.preventDefault();
  // si la quantité est null
  if (quantity.value <= 0 ) {
    alert(" choisissez une quantité entre 1 et 100");
  }
  //si la couleur n'est pas choisi 
  else if (color.value === "" || color.value === null) {
    alert (" choisissez une couleur")
  }
  // si la quantité est supérieur à 100 exemplaires du même produits
  else if (quantity.value > 100) {
    alert (" vous avez choisi trop de produits identiques")
  }
  else{
    const productpicked = {
      id : idRecuperation,
      color: color.value,
      quantity : parseInt(quantity.value)
    };
    addToBasket(productpicked); // appel de la fonction d'ajout au basket
  }

  });


