// Fonction pour récupérer les produits depuis l'API HTTP
async function getProducts() {
    await fetch ("http://localhost:3000/api/products/")
    .then(res => res.json())
    .then(JSON => products = JSON)
    .catch(err => console.log("Error API", err))
};
// Récupération des produits
getProducts();

// Fonction pour générer la liste des produits
async function generateProducts() {
    await getProducts();

    // Création des fiches produits
    for (let i = 0; i < products.length; i++) {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const listProducts = document.getElementById("items");

        // Création de la fiche produit, récupération de l'indice i de la liste produit et rattachement à son parent
        const product = document.createElement("a");
        product.setAttribute("href", "product.html?id=" + products[i]._id);
        listProducts.appendChild(product);

        // Création des balises articles
        const cardProduct = document.createElement ("article");
        product.appendChild(cardProduct);

        // Création des images avec leur URL et attributs Alt
        const imageProduct = document.createElement("img");
        imageProduct.src = products[i].imageUrl;
        imageProduct.setAttribute("alt", products[i].altTxt);
        cardProduct.appendChild(imageProduct);

        // Création des noms des produits
        const nameProduct = document.createElement("h3");
        nameProduct.innerText = products[i].name;
        cardProduct.appendChild(nameProduct);

        // Création des descriptions des produits
        const descriptionProduct = document.createElement("p");
        descriptionProduct.innerText = products[i].description ?? "Pas de description pour le moment.";
        cardProduct.appendChild(descriptionProduct);
        
    }
}

// Génération de la liste des produits
generateProducts();