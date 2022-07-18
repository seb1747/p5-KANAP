let idRecuperation = new URL(window.location.href).searchParams.get('id');
//recupération des paramètres ID depuis l'adresse URL
console.log(idRecuperation);

fetch('http://localhost:3000/api/products/' + idRecuperation) // appel des elements de l'api
  .then((res) => {
    

    const response = res.json();
    //récupération du produit par son id 
    response.then(product => {
      console.log(product);
      
      // création et intégration des élémentsq du DOM

      let addToCart = document.getElementById('addToCart');
      let colors = document.getElementById('colors');
      let img = document.createElement('img');
      let quantity = document.querySelector('#quantity');
      let price = document.getElementById('price').innerHTML = product.price;
      let name = document.getElementById('title').innerHTML = product.name;
      document.querySelector(".item__img").appendChild(img);
      document.querySelector("#colors").insertAdjacentHTML('beforeend',product.colors.map((color) =>`<option id= "valueColor" value="${color}">${color}</option>`));
      document.getElementById("description").innerHTML = product.description;
      img.src = product.imageUrl;
      img.alt = product.altTxt;
      let image = img.src;
      let imageAlt = img.alt;

      class objBasket {
        constructor(){
          this.id = idRecuperation;
          this.name = product.name;
          this.description = product.description;
          this.imageUrl = product.imageUrl;
          this.altText = product.altText;
    
        }
      }
      console.log(product.name);

      // ecoute du bouton au click 
      addToCart.addEventListener("click",(e) =>{
        e.preventDefault();
        let color = colors.value;
        let quantities = Number(quantity.value);

        // création des données du du tableau pour le local storage 

        let productInfo = new objBasket ;
          
      
        
        // création du tableau vide pour récupérer les données 
        let registerItem = [];
          console.log(registerItem);
        // condition si le local storage contient un produit 
        if (localStorage.getItem("product")) {
          // si des données existe, elles sont transférer dans le tableau
          registerItem  = JSON.parse(localStorage.getItem("product"));

          // variable de vérification couleur quantité 
          let compareItem = registerItem.findIndex((item=> item.id === productInfo.id &&  item.color === productInfo.color ));

          // si même couleur on incrémente la quantité 

          if (compareItem !== -1) {
            registerItem[objBasket].quantities += quantities;
          }
          // si le produit n'existe pas dans le tableau je le rajoute 
          else if (compareItem === -1){
            registerItem.push(productInfo)
          }

          // envoi des produits dans le localStorage et conversion des chaine de caractère
          localStorage.setItem("product", JSON.stringify(registerItem));
        }else{
          registerItem.push(productInfo);
          localStorage.setItem("product", JSON.stringify(registerItem))
        }
        
        console.log(productInfo);
        console.log(registerItem);
      });
      });
    });

    