// appel des functions nécessaire


// récupération du localStorage
function getBasket() {
    return JSON.parse(localStorage.getItem('basket'));
};
let basket = getBasket();

// function de sauvegarde du panier 

function saveBasket (basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
};

// fonction de calcul de produit dans le panier 

function totalProductBasket () {
    getBasket();
    let numberOfProduct = 0;
    for (let productInBasket of basket) {
        numberOfProduct += parseInt(productInBasket.quantity);
}
return numberOfProduct; 
};
// fonction pour supprimer un produit dans le panier

function removeProductOfBasket (id, color) {
    getBasket();
    // création d'un objet avec l'id et la couleur du produit 
    const deleteProduct ={
    productId: id,
    productColor: color

};
// création d'un nouvel objet panier qui contiendra les éléments du localStorage id et couleur deifférente 
const newBasket = basket.filter((item) => !(
    item.id == deleteProduct.productId && itemColor == deleteProduct.productColor
));
// on sauvegarde notre panier avec la même clé
localStorage.setItem('basket', JSON.stringify(newBasket));
alert('votre produit a été retiré');
window.location.href =  "cart.html";
};

// fonction pour le change de quantité depuis le panier 
function changeProductQuantity(id, color, newQuantity) {
    getBasket(basket);
    if (newQuantity < 0 || newQuantity > 100) {
        alert('la quantité doit être comprise entre 1 et 100 exemplaires')
        location.reload
    }
    else if (newQuantity == 0){
        removeProductOfBasket(id, color);
    }
    else{
        findSameProduct = basket.find (product => product.id == id && product.color == color);
        if (findSameProduct != undefined ) {
            findSameProduct.quantity = newQuantity;
            alert('la quantité a été modifié')
            window.location.href ="cart.html"
        }
        saveBasket(basket);
    }
};
// création de la fonction pour récupérer la totalité des prix de chaque produit 
let totalPrice = [];
// fonction pour le calcul des prix du panier 
function totalBasketPrice() {
    const calculPrice = (accumulator, currentValue) => accumulator + currentValue;
    let total = totalPrice.reduce(calculPrice);
    return total;
};

// function on affiche le panier si celui-ci n'est pas vide 
function basketDisplay() {
    if (basket != null) {
        // on verifie qu'il y a quelqque chose dans le panier
        for ( let productPicked of basket) {
            // récupération des données des produits
            fetch("http://localhost:3000/api/products/" + productPicked.id)
            .then((response) => {
                response.json()
                .then((product) => {
                    // récupération des articles du DOM
                    document.getElementById("cart__items").innerHTML +=
                    `<article class="cart__item" data-id="${productPicked.id}" data-color="${productPicked.color}">
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>${productPicked.color}</p>
                            <p>${product.price}€</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productPicked.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`
                //Ajout de la quantité total de canapé dans le panier
                document.getElementById("totalQuantity").innerHTML = parseInt(totalProductBasket());
                // calcul du total du panier 
                let totalProductPrice = parseInt(productPicked.quantity)* parseInt(product.price);
                totalPrice.push(totalProductPrice);
                    // ajout du prix total du panier 
                document.getElementById("totalPrice").innerHTML = totalBasketPrice();
                // on modifie les quantité 
                // récupérationde l'input dans le DOM 
                let input = document.getElementsByClassName("itemQuantity");
                // création d'un tableau attribut article et la value de l'input 
                Object.values(input).forEach(quantity => {
                    quantity.addEventListener('change', function(){
                        let article = quantity.closest("article");
                        let id = article.getAttribute("data-id");
                        let color = article.getAttribute("data-color");
                        let newQuantity = quantity.value; 
                        changeProductQuantity(id, color, newQuantity);
                    });
                });
                // supresson d'un produit du panier 
                let supressionButton = document.getElementsByClassName("deleteItem");
                // création d'un tableau pour gérer la saupression  
                Object.values(supressionButton).forEach(deleteProduct => {
                    deleteProduct.addEventListener('click', function() {
                        let article = deleteProduct.closest("article");
                        let id = article.getAttribute("data-id");
                        let color = article.getAttribute("data-color"); 
                        removeProductOfBasket (id, color);
                    })
                });
            
                });
            });
        };
    };
};
               
// rappel de la fonction d'affichage du panier
basketDisplay(); 
