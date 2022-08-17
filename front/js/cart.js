

// Déclaration de variable objet ajouté
let basket = JSON.parse(localStorage.getItem("basket"));


// Fonction pour récupérer les produits du LocalStorage
async function getProduct() {
  // on créé un tableau vide pour récupérer les éléments 

  let fullBasket = [];

  // LS à jour
  let CartLocalStorage = JSON.parse(localStorage.getItem("basket"));

  // la boucle attend que le fetch soit fini pour chaque tour de boucle
  for (i = 0; i < CartLocalStorage.length; i++) {
    await fetch("http://localhost:3000/api/products/" + CartLocalStorage[i]._id)
      .then(function (res) {
        return res.json();
      })
      .then((products) => {
       

        // on créé un objet comporant les propriétés et les valeurs nécessaires pour consituer le localStorage
        const obj = {
          _id: products._id,
          name: products.name,
          price: products.price,
          color: CartLocalStorage[i].option,
          quantity: CartLocalStorage[i].quantity,
          alt: products.altTxt,
          img: products.imageUrl,
        };
        // on pousse l'objet dans le tableau créé
        fullBasket.push(obj);
        
      })
      .catch(function (error) {
       
      });
  }
  return fullBasket;
}

// Initialisation des fonctions
init();
async function init() {
  let fullBasket = await getProduct();
  createBasket(fullBasket);

  removeProduct();

  modifyQuantity();

  calculQuantity();
  calculPrice();
}

// Fonction pour créer le HTML du panier dans lequel sont insérés les propriétés du tableau "Panier Complet"
function createBasket(fullBasket) {
  const kanapItem = document.getElementById(`cart__items`);

  

  fullBasket.map((product) => {
    kanapItem.innerHTML += `
    <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
        <div class="cart__item__img">
            <img src="${product.img}" alt="${product.alt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${product.name}</h2>
                <p>${product.price}€</p>
            </div>
            <div class="cart__item__content__settings">
                <p>Couleur : ${product.color}</p>
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté :  </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
        </div>
    </article>
    `;
  });
}

// Fonction pour supprimer un produit dans le panier
function removeProduct() {
  let deleteKanap = [...document.getElementsByClassName("deleteItem")];

  deleteKanap.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Dans le DOM
      let productPicked = deleteKanap[index].closest(".cart__item");
      productPicked.remove();
      // Dans le local storage
     basket.splice(index,);
      localStorage.setItem(
        "basket",
        JSON.stringify(basket)
      );
      alert('vous avez supprimé un produit !')
      calculPrice();
      calculQuantity();
    });
  });
}

// Fonction pour modifier la quantité d'un produit dans le panier
function modifyQuantity() {
  const quantityInput = document.querySelectorAll(".itemQuantity");
  quantityInput.forEach((quantityProduct) => {
    quantityProduct.addEventListener("change", (e) => {
      changeQuantity(e);
      alert('Vous avez changé la quantité ! ')
      calculPrice();
      calculQuantity();
    });
  });
}

function changeQuantity(e) {
  // On récupère l'input le plus proche de l'élément cliqué
  const quantityElement = e.target.closest("input.itemQuantity").value; //cibler l'input pour le changement de quantité
 
  if (quantityElement != null) {
    // On récupère les id et color du produit pour aller le chercher dans le LS
    const productId = e.target
      .closest("article.cart__item")
      .getAttribute("data-id");
    const productColor = e.target
      .closest("article.cart__item")
      .getAttribute("data-color");

    //on vas chercher le contenu du LS
    let cart = JSON.parse(localStorage.getItem("basket"));

    // On recherche le produit correspondant
    let foundProduct = cart.findIndex(
      (p) => p._id === productId && p.option === productColor
    );
   

    // Si on le trouve et que la quantité est inférieur ou égale à 100 et suppérieur ou égale à 1, on modifie le panier LS
    if (
      foundProduct != undefined &&
      quantityElement <= 100 &&
      quantityElement >= 1
    ) {
      //ajouter la nouvelle quantité au LS
      cart[foundProduct].quantity = quantityElement;

     
      // On repush le LS tout neuf
      localStorage.setItem("basket", JSON.stringify(cart));
    }
  }
}

// Fonction pour calculer le nombre de produit total dans le panier
function calculQuantity() {
  let number = 0;
  let CartLocalStorage = JSON.parse(localStorage.getItem("basket"));
  for (let j = 0; j < CartLocalStorage.length; j++) {
    let quantityLoop = parseInt(CartLocalStorage[j].quantity);
    number += quantityLoop;
  }
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerText = number;
}

// Fonction pour calculer le prix total du panier
async function calculPrice() {
  const kanapItem = await getProduct();
  let totalPrice = 0;
  for (let product of kanapItem) {
    totalPrice += product.quantity * product.price;
  }

 
  let totalPriceCart = document.getElementById("totalPrice");
  totalPriceCart.innerText = totalPrice;
  return totalPrice;
}

////**** FORMULAIRE****////



// Variables RegEx pour éviter les erreurs de caratéres
let RegEx1 = /^(?=.{2,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
let RegEx2 = /^[a-zA-Z\-1-9]+$/;

let checkFormulaire = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false,
};

// Formulaire Contact, vérification du formulaire uniquement au clic sur le bouton commander

const button = document.getElementById("order");
button.addEventListener("click", (e) => {
  e.preventDefault();

  // Si le clic vient de l'input quantité, on stoppe
 
  if (e.target.name === "itemQuantity") {
    return;
  }

  //Fonction pour vérifier le prénom
  function validFirstName() {
    let firstName = document.getElementById("firstName").value;
    let text = document.getElementById("firstNameErrorMsg");
    // Prise en compte des Regex
    let pattern = RegEx1;
    let number = RegEx2;

    if (firstName.match(pattern)) {
      text.innerHTML = "Prénom valide";
      
      checkFormulaire.firstName = true;
      return firstName;
    } else if (firstName.match(number)) {
      alert ("Les chiffres ne sont pas tolérés");
      
      checkFormulaire.firstName = false;
    } else {
      text.innerHTML = "Merci de rentrer un prénom valide";
      
      checkFormulaire.firstName = false;
    }
  }

  // Fonction pour vérifier le nom
  function validLastName() {
    let lastName = document.getElementById("lastName").value;
    let text = document.getElementById("lastNameErrorMsg");
    let pattern = RegEx1;
    let number = RegEx2;

    if (lastName.match(pattern)) {
      text.innerHTML = "nom valide";
      checkFormulaire.lastName = true;
      return lastName;
    } else if (lastName.match(number)) {
      alert('les chiffres ne sont pas tolérés !')
      checkFormulaire.lastName = false;
    } else {
      alert("veuillez entrer un nom valide")
      checkFormulaire.lastName = false;
    }
  }

  // Fonction pour vérifier l'adresse postale
  function validAddress() {
    let address = document.getElementById("address").value;
    let text = document.getElementById("addressErrorMsg");
    let pattern = "([0-9a-zA-Z,. ]*) ?([0-9]{5}) ?([a-zA-Z]*)";

    if (address.match(pattern)) {
      
     text.innerHTML = "adresse valide"
      checkFormulaire.address = true;
      return address;
    } else {
     alert('veuillez saisir une adresse valide')
      checkFormulaire.address = false;
    }
  }
  // Fonction pour vérifier la ville
  function validCity() {
    let city = document.getElementById("city").value;
    
    let pattern = /^[a-z ,.'-]+$/i;

    if (city.match(pattern)) {
      
      checkFormulaire.city = true;
      return city;
    } else {
      alert( "Merci de rentrer une ville valide");
      
      checkFormulaire.city = false;
    }
  }
  //Fonction pour vérifier l'Email
  function validEmail() {
    let mail = document.getElementById("email").value;
    let text = document.getElementById("emailErrorMsg");
    let pattern = new RegExp(
      "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
      "g"
    );

    if (mail.match(pattern)) {
     text.innerHTML= 'email valide'
      checkFormulaire.email = true;
      return mail;
    } else {
      alert( "Merci de rentrer une adresse valide");
      
      checkFormulaire.email = false;
    }
  }

  // On appelle les fonctions pour qu'elles puissent s'afficher sur le DOM
  validFirstName();
  validLastName();
  validAddress();
  validCity();
  validEmail();
});

// Fonction pour envoyer le formulaire au LocalStorage et faire apparaitre la page de confirmation
function sendOrder() {
  // on créé l'objet contact
  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };

  // on crée le tableau consituté des ID des produits à partir du LS
  let products = [];
  for (let i = 0; i < basket.length; i++) {
    products.push(basket[i]._id);
  }

  // on créé une constante pour lier l'API avec la commande
  const order = {
    contact,
    products,
  };

  //on met en place le lien avec API de la commande
  const orderId = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-type": "application/json",
    },
  });

  // Pour voir le résultat du serveur dans la console
  orderId.then(async (response) => {
    try {
      const content = await response.json();

      if (response.ok && basket) {
        // Redirection vers la page confirmation
        window.location = `../html/confirmation.html?id=${content.orderId}`;
      } else {
        
      }
    } catch (error) {
     
    }
  });
}

// On ajoute un événement au clic pour vérifier que le formulaire est correctement rempli avant de l'envoyer au LS
let sendContact = document.getElementById("order");

sendContact.addEventListener("click", (e) => {
  e.preventDefault();

  // On suppose que tout le formulaire est valide
  let formOK = true;

  // On vérifie que toutes les entrées input sont true dans checkFormulaire
  // Si une entrée est false, on passe formOK à false
  for (let input in checkFormulaire) {
    if (checkFormulaire[input] === false) {
      formOK = false;
    }
  }
 
  // si formOK est true, on peut valider la commande, sinon on ne fait rien
  if (formOK === true) {
    sendOrder();
  }
});

// On rajoute la quantité totale à côté du panier pour contrôle
let cart = () => {
  let panier = document
    .getElementsByTagName("nav")[0]
    .getElementsByTagName("li")[1];

  letbasket = JSON.parse(localStorage.getItem("products"));

  let totalQty = 0;
  for (let q in basket) {
    let loop = parseInt(basket[q].quantity);
    totalQty += loop;
  }

  panier.innerHTML = `Panier <span id="test" style='color:purple'>${"("}${totalQty}${")"}</span>`;
};
cart();
