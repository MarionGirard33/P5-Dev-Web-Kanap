// Création de la liste des fiches produits ------------------------------------------------------

// Fonction pour récupérer les produits depuis l'API HTTP
/**
 * @return { Promise } si ok : JSON des produits, sinon : Error API
 */
async function getProducts() {
    try {
        const response = await fetch ("http://localhost:3000/api/products/");
        const products = await response.json();
        return products;
    } catch(err) {
        console.log("Error API", err);
        alert("Problème technique");
    };
};

// Fonction pour créer les éléments dans le DOM
/**
 * @param { Object } productData Objet contenant les produits et leurs données (Id,img,name...)
 * @return { HTMLAnchorElement } Elément HTML <a>
 */
function createListProducts(productData) {
    // Création de la fiche produit, récupération des data des produits et rattachement à son parent
    const productElement = document.createElement("a");
    productElement.setAttribute("href", "product.html?id=" + productData._id);
    
    // Création des balises articles
    const cardElement = document.createElement ("article");
    productElement.appendChild(cardElement);

    // Création des images avec leur URL et attributs Alt
    const imageElement = document.createElement("img");
    imageElement.src = productData.imageUrl;
    imageElement.setAttribute("alt", productData.altTxt);
    cardElement.appendChild(imageElement);

    // Création des noms des produits
    const nameElement = document.createElement("h3");
    nameElement.classList.add("productName");
    nameElement.innerText = productData.name;
    cardElement.appendChild(nameElement);

    // Création des descriptions des produits
    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("productDescription");
    descriptionElement.innerText = productData.description ?? "Pas de description pour le moment.";
    cardElement.appendChild(descriptionElement);

    return productElement;
};

// Fonction pour générer la liste des produits
async function generateProducts() {
    const products = await getProducts();
    // Récupération de l'élément du DOM qui accueillera les fiches
    const productsListElement = document.getElementById("items");
    
    // Création des fiches produits
    for (let i = 0; i < products.length; i++) {
        // Appel de la fonction pour créer les éléments
        const productElement = createListProducts(products[i]);
        productsListElement.appendChild(productElement);   
    }
}
// Génération de la liste des produits
generateProducts();