// Fonction pour récupérer les produits depuis l'API HTTP
/**
 * @param { url } URL de l'API
 */
async function getProducts() {
    try {
        const response = await fetch ("http://localhost:3000/api/products/");
        const products = await response.json();
        return products;
    } catch(err) {
        console.log("Error API", err);
        alert("Problème technique :(")
    }
};

// Fonction pour générer la liste des produits
async function generateProducts() {
    const products = await getProducts();

    // Création des fiches produits
    for (let i = 0; i < products.length; i++) {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const productsListElement = document.getElementById("items");

        // Création de la fiche produit, récupération de l'indice i de la liste produit et rattachement à son parent
        const productElement = document.createElement("a");
        productElement.setAttribute("href", "product.html?id=" + products[i]._id);
        productsListElement.appendChild(productElement);

        // Création des balises articles
        const cardElement = document.createElement ("article");
        productElement.appendChild(cardElement);

        // Création des images avec leur URL et attributs Alt
        const imageElement = document.createElement("img");
        imageElement.src = products[i].imageUrl;
        imageElement.setAttribute("alt", products[i].altTxt);
        cardElement.appendChild(imageElement);

        // Création des noms des produits
        const nameElement = document.createElement("h3");
        nameElement.classList.add("productName");
        nameElement.innerText = products[i].name;
        cardElement.appendChild(nameElement);

        // Création des descriptions des produits
        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("productDescription");
        descriptionElement.innerText = products[i].description ?? "Pas de description pour le moment.";
        cardElement.appendChild(descriptionElement);
        
    }
}

// Génération de la liste des produits
generateProducts();