// Récupération de l'ID du canapé dans le lien
let idProduct = new URL(window.location.href).searchParams.get("id");

// Fonction pour récupérer un produit de l'API grâce à son ID
/**
 * @param { url } URL de l'API + idProduct
 */
async function getOneProduct() {
    try {
        await fetch ("http://localhost:3000/api/products/" + idProduct)
        .then(res => res.json())
        .then(JSON => product = JSON)
    } catch (err) {
        console.log("Error API", err)
    }
};

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
    
    // Création du prix du produit
    const priceProduct = document.getElementById("price");
    priceProduct.innerText = product.price;

    // Création de la description du produit
    const descriptionProduct = document.getElementById("description");
    descriptionProduct.innerText = product.description ?? "Pas de description pour le moment.";

    // Création des options de couleur du produit
      let colorsOption = document.getElementById("colors");

      for (let i = 0; i < product.colors.length; i++) {
          let colorProduct = document.createElement("option");
          colorProduct.setAttribute("value", product.colors[i]);
          colorProduct.innerText = product.colors[i];
          colorsOption.appendChild(colorProduct);
      }
}
// Génération du produit avec ses propres valeurs
generateOneProduct();


//Fonction pour ajouter des produits dans le localStorage
function addProduct() {
    // Création du localStorage et conversion en JSON
    let localShopping = JSON.parse(localStorage.getItem("selectedProduct"));  
    
    // Ajout du listener sur le bouton
    const button = document.getElementById("addToCart"); 
    button.addEventListener("click", function(event) {

        // Récupération des options choisies
        const color = document.getElementById("colors").value;
        const quantity= document.getElementById("quantity").value;
        let choicesProduct = {
            idProduct : idProduct,
            nameProduct : product.name,
            quantityProduct : quantity,
            colorProduct : color
        };
    
        // Ajout dans le localStorage si quantité et couleur ok
        if (quantity >= 1 && quantity <= 100 && quantity % 1 == 0 && color !="") {
            // Règles de gestion du localStorage
            // Si le localStorage n'est pas vide
            if (localShopping) {
                const searchProduct = localShopping.find(
                    (p) => p.idProduct === idProduct && p.colorProduct === color);
                    // Si le produit existe dans le localStorage
                    if (searchProduct) {
                        let newQuantity =
                        parseInt(choicesProduct.quantityProduct) + parseInt(searchProduct.quantityProduct);
                        searchProduct.quantityProduct = newQuantity;
                        localStorage.setItem("selectedProduct", JSON.stringify(localShopping));
                    // Si le produit n'existe pas dans le localStorage
                    } else {
                        localShopping.push(choicesProduct);
                        localStorage.setItem("selectedProduct", JSON.stringify(localShopping));
                    }
            // Si le localStorage est vide
            } else { 
            localShopping =[];
            localShopping.push(choicesProduct);
            localStorage.setItem("selectedProduct", JSON.stringify(localShopping));
            }
        } else {
            alert("Merci de choisir une couleur et une quantité comprise entre 1 et 100");
        }
    }); 
};

//Ajout et gestion des produits dans le localStorage
addProduct();

