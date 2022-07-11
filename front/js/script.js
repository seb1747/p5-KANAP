//indication de l'emplacement d'injection du code
const products = document.querySelector('#items');
//récupération de l'api
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((product) => //creation de la boucle pour appel des produits
  {for (insertproducts of product){
   console.log(insertproducts)
    products.innerHTML+= `
    <a href="./product.html?id=${insertproducts._id}">       
    <article>
      <img src="${insertproducts.imageUrl}" alt="${insertproducts.altTxt}">
      <h3 class="productName">${insertproducts.name}</h3>
      <p class="productDescription">${insertproducts.description}</p>
    </article>
    </a>
     `;
  }})
  .catch((erreur) => 'erreur: ' + erreur);



  
 
    
   


