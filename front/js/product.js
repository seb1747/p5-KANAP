

let idRecuperation = new URL(window.location.href).searchParams.get('id');
//recupération des paramètres ID depuis l'adresse URL
console.log(idRecuperation);

let image = document.querySelector("item__img");//récupération du selecteur css afin de pouvoir insérer l'image
let name = document.getElementById("title");//récupération de l'élément par son id pour injection 
let price = document.getElementById("price");//récupération du prix
let productDescription = document.getElementById("description");//récupération de la dexcription du produit
let colorTable = document.getElementById("colors");//récupération du tableau des couleur product

//création de la fonction de récupération des produits 
let product;

     fetch('http://localhost:3000/api/products')
    .then((res) => res.json()
    .then( product = json )
    .catch((err) => console  && console.error(err)));


console.log(product);