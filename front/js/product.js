// Récupération de l'ID du canapé dans le lien
let idProduct = new URL(window.location.href).searchParams.get("id");

// Fonction pour récupérer un produit de l'API grâce à son ID
async function getOneProduct() {
    await fetch ("http://localhost:3000/api/products/" + idProduct)
    .then(res => res.json())
    .then(JSON => product = JSON)
    .catch(err => console.log("Error API", err))
};

// Récupération du produit
getOneProduct;

// Fonction pour générer la fiche produit
async function generateOneProduct() {
    await getOneProduct();

    // Création de l'image avec son URL et son attribut Alt
    const imageContainer = document.querySelector(".item__img");
    const imageProduct = document.createElement("img");
    imageProduct.src = product.imageUrl;
    imageProduct.setAttribute("alt", product.altTxt);
    imageContainer.appendChild(imageProduct);

    // Création du nom du produit
    const nameProduct = document.getElementById("title");
    nameProduct.innerText = product.name;
    
    // Création du nom du produit
    const priceProduct = document.getElementById("price");
    priceProduct.innerText = product.price;

    // Création de la description du produit
    const descriptionProduct = document.getElementById("description");
    descriptionProduct.innerText = product.description ?? "Pas de description pour le moment.";
}

// Génération de la liste des produits
generateOneProduct();