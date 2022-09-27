// Création des fiches des produits du panier ------------------------------------------------

// Création de la constante panier du localStorage
const selectedProduct = ("selectedProduct");
// Récupération du localStorage
let localShopping = JSON.parse(localStorage.getItem(selectedProduct)); 

// Fonction pour créer les éléments dans le panier
/**
 * @param { Object } shop Objet contenant les produits sélectionnés dans le localStorage(Id,color,quantity)
 * @param { Object } data Objet contenant les données des produits (Id,img,name,price...)
 */
 function createListShopping(shop, data) {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const productsListElement = document.getElementById("cart__items");

    // Création des balises articles
    const articleElement = document.createElement ("article");
    articleElement.classList.add("cart__item");
    articleElement.setAttribute("data-id", shop.idProduct);
    articleElement.setAttribute("data-color", shop.colorProduct);
    productsListElement.appendChild(articleElement);

    // Création de l'élément div pour l'image
    const imageContainer = document.createElement ("div");
    imageContainer.classList.add("cart__item__img");
    articleElement.appendChild(imageContainer);

    // Création des images avec leur URL et attributs Alt
    const imageElement = document.createElement("img");
    imageElement.src = data.imageUrl;
    imageElement.setAttribute("alt", data.altTxt);
    imageContainer.appendChild(imageElement);

    // Création de l'élément div pour le détail du produit
    const contentProductContainer = document.createElement ("div");
    contentProductContainer.classList.add("cart__item__content");
    articleElement.appendChild(contentProductContainer);

    // Création de l'élément div pour la description du produit
    const descriptionElement = document.createElement ("div");
    descriptionElement.classList.add("cart__item__content__description");
    contentProductContainer.appendChild(descriptionElement);

    // Création des noms des produits
    const nameElement = document.createElement("h2");
    nameElement.innerText = data.name;
    descriptionElement.appendChild(nameElement);

    // Création des couleurs des produits
    const colorElement = document.createElement("p");
    colorElement.innerText = shop.colorProduct;
    descriptionElement.appendChild(colorElement);

    // Création des prix des produits
    const priceElement = document.createElement("p");
    priceElement.innerText = data.price + "€";
    descriptionElement.appendChild(priceElement);

    // Création de l'élément div pour la gestion du produit
    const settingsElement = document.createElement ("div");
    settingsElement.classList.add("cart__item__content__settings");
    contentProductContainer.appendChild(settingsElement);
    
    // Création de l'élément div pour la gestion de la quantité du produit
    const settingQuantityElement = document.createElement ("div");
    settingQuantityElement.classList.add("cart__item__content__settings__quantity");
    settingsElement.appendChild(settingQuantityElement);

    // Création du texte pour la quantité du produit
    const textQuantityElement = document.createElement ("p");
    textQuantityElement.innerText = "Qté : ";
    settingQuantityElement.appendChild(textQuantityElement);

    // Création de l'input pour la quantité du produit
    const quantityInputElement = document.createElement ("input");
    quantityInputElement.value = shop.quantityProduct;
    quantityInputElement.setAttribute("type", "number");
    quantityInputElement.classList.add("itemQuantity");
    quantityInputElement.setAttribute("name", "itemQuantity");
    quantityInputElement.setAttribute("min", "1");
    quantityInputElement.setAttribute("max", "100");
    settingQuantityElement.appendChild(quantityInputElement);

    // Création de l'élément div pour la gestion de la suppression du produit
    const settingDeleteContainer = document.createElement ("div");
    settingDeleteContainer.classList.add("cart__item__content__settings__delete");
    settingsElement.appendChild(settingDeleteContainer);

    // Création de l'élément div pour la suppression du produit
    const deleteElement = document.createElement ("p");
    deleteElement.classList.add("deleteItem");
    deleteElement.innerText = "Supprimer";
    settingDeleteContainer.appendChild(deleteElement);
};

// Création du script dans le HTML pour pouvoir appeler la fonction qui récupère les données de l'API pour un Id depuis le fichier global-function.js
const script = document.createElement("script");
script.src = "../js/global-function.js";
script.onload = function() { 
    generateShopping();
};
document.head.appendChild(script);

// Fonction pour générer la liste des produits présents dans le panier
async function generateShopping() {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const productsListElement = document.getElementById("cart__items");

    // Affichage message si le localStorage est vide
    if (localShopping === null || localShopping === 0) {
        productsListElement.innerText = ("Votre panier est vide, veuillez sélectionner au moins un article svp");
    } else {
        // Fonction pour trier les articles du localStorage
        localShopping.sort(function (a, b) {
            if (a.nameProduct < b.nameProduct)
                return -1;
            if (a.nameProduct > b.nameProduct)
                return 1;
            return 0;
        });
        // Création des fiches des produits présents dans le localStorage
        for (let selectedProduct in localShopping) {
            // Récupération des données de l'API pour chaque Id
            const dataProducts = await getOneProduct(localShopping[selectedProduct].idProduct);
            
            createListShopping(localShopping[selectedProduct], dataProducts);
        }
    };
    // Appel des fonctions de calcul de la quantité totale, du prix total, de modification de quantité, et de suppression d'item
    addChangeQuantityEvent();
    addDeleteItemEvent();
    const totalQuantity = calculateQuantity(localShopping);
    let totalQuantityElement = document.getElementById("totalQuantity");
    totalQuantityElement.innerText = totalQuantity;
    
    const totalPrice = await calculatePrice(localShopping);
    let totalPriceElement = document.getElementById("totalPrice");
    totalPriceElement.innerText = totalPrice;
};


// Fonctions de calcul de la quantité totale, du prix total, de modification de quantité, et de suppression d'item --------------------------------------------------------------------------------------------------

// Fonction pour modifier la quantité d'un produit
function addChangeQuantityEvent() {
    // Ajout du listener sur la quantité
    const itemQuantity = document.querySelectorAll(".itemQuantity");
    itemQuantity.forEach((item) => {
        item.addEventListener("change", async function(event) {
            event.preventDefault(); 
            const newQuantity = event.target.value; 
            // Récupération de l'ID et de la couleur et recherche du produit dans le localStorage
            let newQuantityProduct = item.closest("article");
            const searchProduct = localShopping.find((p) => p.idProduct === newQuantityProduct.dataset.id && p.colorProduct === newQuantityProduct.dataset.color);
            // Modification de la quantité du produit trouvé dans le localStorage
            if (searchProduct){ 
                searchProduct.quantityProduct = newQuantity
                // Contrôle si quantité ok
                if (newQuantity >= 1 && newQuantity <= 100 && Number.isInteger(+newQuantity)) {
                    localStorage.setItem(selectedProduct, JSON.stringify(localShopping))
                    const totalQuantity = calculateQuantity(localShopping);
                    let totalQuantityElement = document.getElementById("totalQuantity");
                    totalQuantityElement.innerText = totalQuantity;
                    
                    const totalPrice = await calculatePrice(localShopping);
                    let totalPriceElement = document.getElementById("totalPrice");
                    totalPriceElement.innerText = totalPrice;
                } else {
                    alert("Merci de choisir une quantité entre 1 et 100 (nombre entier)")
                }
            }                 
        })
    })
};


// Fonction pour supprimer un produit du panier
function addDeleteItemEvent() {
    // Ajout du listener sur la suppression
    let deleteItem = document.querySelectorAll(".deleteItem");
    deleteItem.forEach((deleted) => {
        deleted.addEventListener("click", async function(event) {
            event.preventDefault(); 
            // Récupération de l'ID à supprimer
            let deletedProduct = event.target.closest("article");
            // Récupération du localStorage
            let localShopping = JSON.parse(localStorage.getItem(selectedProduct)); 
            // Filtre du localStorage pour ne conserver que les produits non supprimés
            const filtreLocalShopping = localShopping.filter((p) => p.idProduct !== deletedProduct.dataset.id || p.colorProduct !== deletedProduct.dataset.color);
            deletedProduct.remove();
            localStorage.setItem(selectedProduct, JSON.stringify(filtreLocalShopping));

            const totalQuantity = calculateQuantity(filtreLocalShopping);
            let totalQuantityElement = document.getElementById("totalQuantity");
            totalQuantityElement.innerText = totalQuantity;
            
            const totalPrice = await calculatePrice(filtreLocalShopping);
            let totalPriceElement = document.getElementById("totalPrice");
            totalPriceElement.innerText = totalPrice;
        })
    })
};


// Fonction pour calculer la quantité totale 
/**
 * @param { Object } localS Objet contenant les produits sélectionnés dans le localStorage(Id,color,quantity)
 */
function calculateQuantity(localS) {
    let quantity = 0;
    if (localS) {
        for (let selectedProduct of localS) {
            quantity = quantity + +selectedProduct.quantityProduct;
        }
        return quantity;
    } else {
        return 0;
    }
};


// Fonction pour calculer le prix total
/**
 * @param { Object } localS Objet contenant les produits sélectionnés dans le localStorage(Id,color,quantity)
 */
async function calculatePrice(localS) {
    let price = 0;
    if (localS) {
        for (let i = 0; i < localS.length; i++) {
            const dataProducts = await getOneProduct(localS[i].idProduct);
            price += localS[i].quantityProduct * dataProducts.price;
        }
        return price;   
    } else {
        return 0;
    }
};


// Formulaire -------------------------------------------------------------------------

const firstNameElement = document.getElementById("firstName");
const lastNameElement = document.getElementById("lastName");
const addressElement = document.getElementById("address");
const cityElement = document.getElementById("city");
const emailElement = document.getElementById("email");

// Vérification des données saisies dans le formulaire
function addValidFormEvent() {

     // Déclaration des Regex
    let nameRegex = /^([A-Za-z]{3,20}-{0,1})?([A-Za-z]{3,20})$/;
    let addressRegex = /^(.){2,50}$/;
    let cityRegex = /^[a-zA-Zéèàïêç\-\s]{2,30}$/;
    let emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;  

    // Prénom : Ajout du listener et appel de la fonction de validation
    firstNameElement.focus();
    firstNameElement.addEventListener("change", function(event) {
        event.preventDefault();
        if (nameRegex.test(firstNameElement.value) == false || firstNameElement.value == "") {
            document.getElementById("firstNameErrorMsg").innerText = "Le prénom est un champ obligatoire, veuillez le renseigner sans caractères spéciaux ni chiffres.";
            return false;
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
            return true;
        }
    });

    // Nom : Ajout du listener et appel de la fonction de validation
    lastNameElement.addEventListener("change", function(event) {
        event.preventDefault();
        if (nameRegex.test(lastNameElement.value) == false || lastNameElement.value == "") {
            document.getElementById("lastNameErrorMsg").innerText = "Le nom est un champ obligatoire, veuillez le renseigner sans caractères spéciaux ni chiffres.";
            return false;
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
            return true;
        }
    });

    // Adresse : Ajout du listener et appel de la fonction de validation
    addressElement.addEventListener("change", function(event) {
        event.preventDefault();
        if (addressRegex.test(addressElement.value) == false || addressElement.value == "") {
            document.getElementById("addressErrorMsg").innerText = "L'adresse est un champ obligatoire, veuillez la renseigner (max 50 caractères).";
            return false;
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
            return true;
        }
    });

    // Ville : Ajout du listener et appel de la fonction de validation
    cityElement.addEventListener("change", function(event) {
        event.preventDefault();
        if (cityRegex.test(cityElement.value) == false || cityElement.value == "") {
            document.getElementById("cityErrorMsg").innerText = "La ville est un champ obligatoire, veuillez la renseigner sans caractères spéciaux ni chiffres (max 30 caractères).";
            return false;
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
            return true;
        }
    });

    // email : Ajout du listener et appel de la fonction de validation
    emailElement.addEventListener("change", function(event) {
        event.preventDefault();
        if (emailRegex.test(emailElement.value) == false || emailElement.value == "") {
            document.getElementById("emailErrorMsg").innerText = "L'email est un champ obligatoire, veuillez le renseigner, exemple : JohnDoe@gmail.fr ";
            return false;
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
            return true;
        }
    });

}
// Validation du formulaire
addValidFormEvent();

// La commande -------------------------------------------------------------------------

// Enregistrement de la commande
document.getElementById("order").addEventListener("click", async function(event) {
    event.preventDefault();

    // Création de l'objet contact avec les coordonnées de l'acheteur
    let contact = {
        firstName: firstNameElement.value,
        lastName: lastNameElement.value,
        address: addressElement.value,
        city: cityElement.value,
        email: emailElement.value
    };

    // Création de l'Array qui contiendra l'ID des produits sélectionnés
    let products = [];

    // Création de l'objet contenant l'objet contact et l'Array products
    let validOrder = { contact, products };

    // Vérification de la complétion du formulaire et du panier
    if (firstNameElement.value === "" || lastNameElement.value === "" || addressElement.value === "" || cityElement.value === "" || emailElement.value === "") {
        alert("Merci de renseigner vos coordonnées pour passer la commande.");
    } else if (localShopping === null || localShopping === 0) {
        alert("Merci de compléter votre panier pour passer la commande.");
    } else {
        // Enregistrement des infos de contact stringifiées dans le localStorage
        localStorage.setItem("contact", JSON.stringify(contact));

        // Ajout des ID des produits sélectionnés dans l'Array products
        for(let selectedProduct of localShopping) {
            products.push(selectedProduct.idProduct);
        }

        // Envoi de la commande à l'API
        const commandId = await pushOrder(validOrder);
        localStorage.clear();
        window.location.href = "confirmation.html?id=" + commandId;
    }
});


// Fonction pour envoyer la commande à l'API
/**
 * @param { Object } order Objet contenant les Id des produits sélectionnés et les informations du contact
 * @return { String } si ok : Id de la commande, sinon : Error API
 */
async function pushOrder(order) {
    try {
        const response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Content-type" : "application/json;charset=utf-8"
            },
            body: JSON.stringify(order)
        });
        const orderResponse = await response.json();
        return orderResponse.orderId;
    } catch(err) {
        console.log("Error API", err);
        alert("Problème technique :(");
    };
};
