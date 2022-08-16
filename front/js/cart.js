// appel des functions nécessaire


// récupération du localStorage
/**
 *
 *
 * @return {*} 
 */
function getBasket() {
    return JSON.parse(localStorage.getItem('basket'));
};
let basket = getBasket();

// function de sauvegarde du panier 

/**
 *
 *
 * @param {*} basket
 */
function saveBasket (basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
};

// fonction de calcul de produit dans le panier 

/**
 *
 *
 * @return {*} 
 */
function totalProductBasket () {
    getBasket();
    let numberOfProduct = 0;
    for (let productInBasket of basket) {
        numberOfProduct += parseInt(productInBasket.quantity);
}
return numberOfProduct; 
};
// fonction pour supprimer un produit dans le panier

/**
 *
 *
 * @param {*} id
 * @param {*} color
 */
/**
 *
 *
 * @param {*} id
 * @param {*} color
 */
function removeProductOfBasket (id, color) {
    getBasket();
    // création d'un objet avec l'id et la couleur du produit 
    const deleteProduct ={
    productId: id,
    productColor: color

};
// création d'un nouvel objet panier qui contiendra les éléments du localStorage id et couleur différente 
/** @type {*} */
const newBasket = basket.filter((item) => !(
    item.id == deleteProduct.productId && item.color == deleteProduct.productColor
));
// on sauvegarde notre panier avec la même clé
localStorage.setItem('basket', JSON.stringify(newBasket));
alert('votre produit a été retiré');
window.location.reload();
};

// fonction pour le change de quantité depuis le panier 
/**
 *
 *
 * @param {*} id
 * @param {*} color
 * @param {*} newQuantity
 */
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
           window.location.href ="cart.html";
           
        }
        saveBasket(basket);
    }
};
// création de la fonction pour récupérer la totalité des prix de chaque produit 
/** @type {*} */
let totalPrice = [];
// fonction pour le calcul des prix du panier 
/**
 *
 *
 * @return {*} 
 */
function totalBasketPrice() {
    const calculPrice = (accumulator, currentValue) => accumulator + currentValue;
    let total = totalPrice.reduce(calculPrice);
    return total;
     
};

// function on affiche le panier si celui-ci n'est pas vide 
/**
 *
 *
 */
function basketDisplay() {
    if (basket != null) {
        // on verifie qu'il y a quelqque chose dans le panier
        for ( /** @type {*} */
        let productPicked of basket) {
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
                console.log (totalProductBasket());
                // calcul du total du panier 
                let totalProductPrice = parseInt(productPicked.quantity)* parseInt(product.price);
                totalPrice.push(totalProductPrice);
                console.log(totalPrice)
                    // ajout du prix total du panier 
                document.getElementById("totalPrice").innerHTML = totalBasketPrice();
                // on modifie les quantité 
                // récupération de l'input dans le DOM 
                let input = document.getElementsByClassName("itemQuantity");
                // création d'un tableau attribut article et la value de l'input 
                Object.values(input).forEach(quantity => {
                    quantity.addEventListener('change', function(){
                        let article = quantity.closest("article");
                        let id = article.getAttribute("data-id");
                        let color = article.getAttribute("data-color");
                        let newQuantity = quantity.value; 
                        changeProductQuantity(id, color, newQuantity);
                        window.location.reload();
                    });
                });
                // supression d'un produit du panier 
               
                let supressionButton = document.getElementsByClassName("deleteItem");
                // création d'un tableau pour gérer la supression  
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

//--------------------------------------------------------code formulaire----------------------------------------------------------------------
// function de récupération des éléments du DOM
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let newOrder = document.getElementById("order");

// vérification des élément du formulaire et regex 
email.addEventListener("input", function() {
    let emailRegEx  = /^((\w[^\W]+)[.-]?){1,}@(([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
     let emailTest = emailRegEx.test(email.value)
     let errorMessage = document.getElementById("emailErrorMsg");
     if(!emailTest ) {
        email.style.color = "red";
        errorMessage.innerHTML = "Adresse Email non valide" ;
        return emailValidation = false;
    }
    else {
        email.style.color = "green";
        errorMessage.innerHTML = "";
        return emailValidation = true;
    }
});
// appel de la function de validation des éléments du formulaire 

function ValidationData ( input) {
    // regex formulaire
    let validationDataRegex =/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    // test de la variable regex
    let dataTestName = validationDataRegex.test (input.value);
    let errorMessage = input.nextElementSibling;
    if(!dataTestName ) {
            input.style.color = "red";
            errorMessage.innerHTML = "Caractère non autorisé";
            return false;
        }
        else {
            input.style.color = "green";
            errorMessage.innerHTML = "";
            return true;
        }
};
function Validationaddress ( input) {
    // regex adresse 
    let validationAddressRegex =  /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/;
    let dataTestAddress = validationAddressRegex.test (input.value);
    let errorMessage = document.getElementById("addressErrorMsg");
    if(!dataTestAddress  ) {
        input.style.color = "red";
        errorMessage.innerHTML = "veuillez renseigner un valeur correct les caractère spéciaux ne sont pas autorisés";
        return  false;

}else   {
    input.style.color = "green";
    errorMessage.innerHTML = "";
    return true;
}
};
//validation du prénom 
let firstNameValidation;
firstName.addEventListener('change', function(){
   firstNameValidation = ValidationData(this);
});

// validation du nom 
let lastNameValidation;
lastName.addEventListener('change', function(){
    lastNameValidation = ValidationData(this);
});

// validation de l'adresse 
let addressValidation;
address.addEventListener('change', function(){
   addressValidation =  Validationaddress(this);
    
});

// validation de la ville
let cityValidation;
city.addEventListener('change', function() {
  cityValidation =  ValidationData(this);
});

// fonction pour récupérer les produits et les contacts 
function orderDataProduct (){
    // on créé un tableau vide pour récupérer les produits 
    

    // crétion du tableau de récupération des données des clients 
    let contact =  {
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value,
    };
    let products =[];
    // boucle pour récupérations des id 
    for(let productlist of basket) {
        let item = basket.find( p => p.id == productlist.id);
        if ( item != undefined) {
            // on push les id dans le tableau 
            products.push(productlist.id);
        }
        else {
            alert (" le panier est vide ");
    }
};
console.log(contact);
    // renvoi d'un objet  orderDataProduct contenant 2 tableaux pour en a l'api
    return orderData = { contact, products};
};

// ecoute du bouton commander pour confirmation de commande
newOrder.addEventListener("click", (e) => {
    e.preventDefault();
    if (firstName.value == null||firstName.value=== false || lastName.value == null||lastName.value=== false|| email.value == null || email.value===false || city.value == null||
        city.value===false || address.value == null|| address.value=== false) {
        alert ('veuillez remplir tout les champs ')
        return false
        
    }
    else {
        orderDataProduct();
        let options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                },
                body: JSON.stringify(orderData), 
        }

        fetch("http://localhost:3000/api/products/order",options)
           
        
        .then(response => response.json())
        .then(data => {console.log(data);
            //on efface les données du localStorage
            localStorage.clear();
            // renvoie vers la page de confirmation avec le numéro de commande 
            window.location =  `./confirmation.html?orderid=${data.orderId}`;
        })
        .catch((error) => {
            alert (error)
    })    
}
});
