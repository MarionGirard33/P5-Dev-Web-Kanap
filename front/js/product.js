// Récupération de l'ID du canapé dans le lien
let idProduct = new URL(window.location.href).searchParams.get("id");
// Création de la constante panier du localStorage
const selectedProduct = ("selectedProduct");

// Fonction pour insérer les éléments du produit dans le DOM
/**
 * @param { Object } product Objet contenant les données des produits (Id,img,name...)
 */
 function createProduct(product) {
    // Création de l'image avec son URL et son attribut Alt
    const imageContainer = document.querySelector(".item__img");
    const imageElement = document.createElement("img");
    imageElement.src = product.imageUrl;
    imageElement.setAttribute("alt", product.altTxt);
    imageContainer.appendChild(imageElement);

    // Création du nom du produit
    const nameElement = document.getElementById("title");
    nameElement.innerText = product.name;
    
    // Création du prix du produit
    const priceElement = document.getElementById("price");
    priceElement.innerText = product.price;

    // Création de la description du produit
    const descriptionElement = document.getElementById("description");
    descriptionElement.innerText = product.description ?? "Pas de description pour le moment.";

    // Création des options de couleur du produit
      let colorsOption = document.getElementById("colors");

      for (let i = 0; i < product.colors.length; i++) {
          let colorElement = document.createElement("option");
          colorElement.setAttribute("value", product.colors[i]);
          colorElement.innerText = product.colors[i];
          colorsOption.appendChild(colorElement);
      }
};

// Création du script pour pouvoir appeler la fonction qui récupère les données de l'API pour un Id
const script = document.createElement("script");
script.src = "../js/global-function.js";
script.onload = function() { 
    generateOneProduct();
    addProduct();
};
document.head.appendChild(script);

// Fonction pour générer la fiche produit
async function generateOneProduct() {
    const dataProduct = await getOneProduct(idProduct);
    // Appel de la fonction pour insérer les éléments du produit
    createProduct(dataProduct);  
}
// Génération du produit avec ses propres valeurs
generateOneProduct();


//Fonction pour créer le tableau des choix du produit
async function createChoices() {
    // Création du localStorage et conversion en JSON
    let localShopping = JSON.parse(localStorage.getItem(selectedProduct));  
    const product = await getOneProduct(idProduct);
    
    // Récupération des options choisies
    const color = document.getElementById("colors").value;
    const quantity= document.getElementById("quantity").value;
    let choicesProduct = {
        idProduct : idProduct,
        nameProduct : product.name,
        quantityProduct : +quantity,
        colorProduct : color
    };
    addProduct(choicesProduct);   
};

// Fonction pour ajouter un élément dans le localStorage
/**
 * @param { Object } choices Objet contenant les options pour le produits sélectionnés
 */
function addProduct(choices) {
    // Ajout du listener sur le bouton
    const button = document.getElementById("addToCart"); 
    button.addEventListener("click", function(event) {
        // Ajout dans le localStorage si quantité et couleur ok
        if (quantity >= 1 && quantity <= 100 && Number.isInteger(+quantity) && color !="") {
            // Règles de gestion du localStorage
            const messageAjoutPanier = alert("Votre produit a bien été ajouté au panier!");
            // Si le localStorage n'est pas vide
            if (localShopping) {
                    const searchProduct = localShopping.find(
                    (p) => p.idProduct === idProduct && p.colorProduct === color);
                    // Si le produit existe dans le localStorage
                    if (searchProduct) {
                        let newQuantity =
                        (choices.quantityProduct) + parseInt(searchProduct.quantityProduct);
                        searchProduct.quantityProduct = newQuantity;
                        localStorage.setItem(selectedProduct, JSON.stringify(localShopping));
                        messageAjoutPanier;
                    // Si le produit n'existe pas dans le localStorage
                    } else {
                        localShopping.push(choices);
                        localStorage.setItem(selectedProduct, JSON.stringify(localShopping));
                        messageAjoutPanier;
                    }
            // Si le localStorage est vide
            } else { 
            localShopping =[];
            localShopping.push(choices);
            localStorage.setItem(selectedProduct, JSON.stringify(localShopping));
            messageAjoutPanier;
            }
        } else {
            alert("Merci de choisir une couleur et une quantité comprise entre 1 et 100 (nombre entier)");
        }
    });
};



