let idRecuperation = new URL(window.location.href).searchParams.get('id');
//recupération des paramètres ID depuis l'adresse URL
console.log(idRecuperation);

fetch('http://localhost:3000/api/products/' + idRecuperation)
  .then((response) => {
    if (response.ok) return response.json();
    else return res.status(500).json({ error: 'Une erreur est survenue.' });
  })
  .then((product) => {
    console.log(product);
    //const canape = product.colors;
    document.querySelector(
      '#description'
    ).innerHTML += `${product.description}`;
    document.querySelector('#title').innerHTML += `${product.name}`;
    document.querySelector('#price').innerHTML += `${product.price}`;
    document.querySelector(
      '.item__img'
    ).innerHTML += `<img src='${product.imageUrl}' alt='${product.altTxt}' />`;

    for (let color of product) {
      const optionColor = document.createElement('option');
      document.querySelector('#colors').appendChild(optionColor);
      optionColor.value += color;
      optionColor.innerHtml += color;
    }
  });
