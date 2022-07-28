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
    item.id == deleteProduct.productId && item.color == deleteProduct.productColor
));
// on sauvegarde notre panier avec la même clé
localStorage.setItem('basket', JSON.stringify(newBasket));
alert('votre produit a été retiré');
window.location.reload();
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
                        window.location.reload();
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
     let messageError = document.getElementById("emailErrorMsg");
     if(emailTest == false) {
        email.style.color = "red";
        messageError.innerHTML = "Veuillez renseigner une adresse mail valide ";
     }
     else if (emailTest == true ) {
        email.style.color = "green";
        messageError.innerHTML ="";

     }
});
// appel de la function de validation des éléments du formulaire 

function formValidationData ( input) {
    // regex formulaire
    let validationDataRegex =/^[A-Z][A-Za-z-\é\è\ê]+$/;
    // test de la variable regex
    let dataTestName = validationDataRegex.test (input.value);
    let messageError = input.nextElementSibling;
    if(dataTestName == false) {
        input.style.color = "red";
        messageError.innerHTML = "veuillez renseigner un valeur correct les caractère spéciaux et les nombres ne sont autorisés";
        

}else  if(dataTestName==true) {
    input.style.color = "green";
    messageError.innerHTML = "";
}
};
function formValidationaddress ( input) {
    // regex adresse 
    let validationAddressRegex =  /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/;
    let dataTest = validationAddressRegex.test (input.value);
    let messageError = input.nextElementSibling;
    if(!dataTest ) {
        input.style.color = "red";
        messageError.innerHTML = "veuillez renseigner un valeur correct les caractère spéciaux et les nombres ne sont autorisés";

}else   {
    input.style.color = "green";
    messageError.innerHTML = "";
}
};
//validation du prénom 

firstName.addEventListener('change', function(){
    formValidationData(this);
});

// validation du nom 

lastName.addEventListener('change', function(){
    formValidationData(this);
});

// validation de l'adresse 
address.addEventListener('change', function(){
    formValidationaddress(this);
    
});

// validation de la ville
city.addEventListener('change', function() {
    formValidationData;
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
    if (firstName.value == "" || lastName.value == "" || email.value == "" || city.value == "" || address.value == "") {
        alert ('veuillez remplir tout les champs ')
        
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
