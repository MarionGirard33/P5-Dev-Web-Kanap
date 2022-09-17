let localShopping = JSON.parse(localStorage.getItem("selectedProduct")); 

// Fonction pour générer la liste des produits présents dans le panier
async function generateShopping() {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const listProducts = document.getElementById("cart__items");

    // Affichage message si le localStorage est vide
    if (localShopping === null || localShopping === 0) {
        listProducts.innerText = ("Votre panier est vide, veuillez sélectionner au moins un article svp");
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
            // Récupération des données de l'API pour les produits du localStorage
            await fetch ("http://localhost:3000/api/products/" + localShopping[selectedProduct].idProduct)
            .then(res => res.json())
            .then(JSON => dataProducts = JSON)
            .catch(err => console.log("Error API", err));

            
            // Création des balises articles
            const product = document.createElement ("article");
            product.className = "cart__item";
            product.setAttribute("data-id", localShopping[selectedProduct].idProduct);
            product.setAttribute("data-color", localShopping[selectedProduct].colorProduct);
            listProducts.appendChild(product);

            // Création de l'élément div pour l'image
            const imageContainer = document.createElement ("div");
            imageContainer.className = "cart__item__img";
            product.appendChild(imageContainer);

            // Création des images avec leur URL et attributs Alt
            const imageProduct = document.createElement("img");
            imageProduct.src = dataProducts.imageUrl;
            imageProduct.setAttribute("alt", dataProducts.altTxt);
            imageContainer.appendChild(imageProduct);

            // Création de l'élément div pour le détail du produit
            const contentProduct = document.createElement ("div");
            contentProduct.className = "cart__item__content";
            product.appendChild(contentProduct);

            // Création de l'élément div pour la description du produit
            const descriptionProduct = document.createElement ("div");
            descriptionProduct.className = "cart__item__content__description";
            contentProduct.appendChild(descriptionProduct);

            // Création des noms des produits
            const nameProduct = document.createElement("h2");
            nameProduct.innerText = dataProducts.name;
            descriptionProduct.appendChild(nameProduct);

            // Création des couleurs des produits
            const colorProduct = document.createElement("p");
            colorProduct.innerText = localShopping[selectedProduct].colorProduct;
            descriptionProduct.appendChild(colorProduct);

            // Création des prix des produits
            const priceProduct = document.createElement("p");
            priceProduct.innerText = dataProducts.price + "€";
            descriptionProduct.appendChild(priceProduct);

            // Création de l'élément div pour la gestion du produit
            const settingsProduct = document.createElement ("div");
            descriptionProduct.className = "cart__item__content__settings";
            contentProduct.appendChild(settingsProduct);
            
            // Création de l'élément div pour la gestion de la quantité du produit
            const settingQuantityProduct = document.createElement ("div");
            settingQuantityProduct.className = "cart__item__content__settings__quantity";
            settingsProduct.appendChild(settingQuantityProduct);

            // Création du texte pour la quantité du produit
            const textQuantityProduct = document.createElement ("p");
            textQuantityProduct.innerText = "Qté : ";
            settingQuantityProduct.appendChild(textQuantityProduct);

            // Création de l'input pour la quantité du produit
            const quantityProduct = document.createElement ("input");
            quantityProduct.value = localShopping[selectedProduct].quantityProduct;
            quantityProduct.className = "itemQuantity";
            quantityProduct.setAttribute("type", "number");
            quantityProduct.setAttribute("min", "1");
            quantityProduct.setAttribute("max", "100");
            quantityProduct.setAttribute("name", "itemQuantity");
            settingQuantityProduct.appendChild(quantityProduct);

            // Création de l'élément div pour la gestion de la suppression du produit
            const settingDeleteProduct = document.createElement ("div");
            settingDeleteProduct.className = "cart__item__content__settings__delete";
            settingsProduct.appendChild(settingDeleteProduct);

            // Création de l'élément div pour la suppression du produit
            const deleteProduct = document.createElement ("p");
            deleteProduct.className = "deleteItem";
            deleteProduct.innerText = "Supprimer";
            settingDeleteProduct.appendChild(deleteProduct);

        }
    }
    changeQuantity();
    deleteItem();
};

// Génération de la liste des produits dans le panier
generateShopping();


// Fonctions ---------------------------------------------------------

// Fonction pour modifier la quantité de produit
function changeQuantity() {
    // Ajout du listener sur la quantité
    const itemQuantity = document.querySelectorAll(".itemQuantity");
    itemQuantity.forEach((item) => {
        item.addEventListener("change", function(event) {
            event.preventDefault(); 
            const newQuantity = event.target.value; 
            // Récupération de l'ID et de la couleur et recherche du produit dans le localStorage
            let newQuantityProduct = item.closest("article");
            const searchProduct = localShopping.find((p) => p.idProduct === newQuantityProduct.dataset.id && p.colorProduct === newQuantityProduct.dataset.color);
            // Modification de la quantité du produit trouvé dans le localStorage
            if (searchProduct){ 
                searchProduct.quantityProduct = newQuantity
                // Contrôle si quantité ok
                if (newQuantity >= 1 && newQuantity <= 100 && newQuantity % 1 == 0) {
                    localStorage.setItem("selectedProduct", JSON.stringify(localShopping))
                } else {
                    alert("Merci de choisir une quantité entre 1 et 100 (nombre entier)")
                }
            }                 
        })
    })
};


// Fonction pour supprimer un produit du panier
function deleteItem() {
    // Ajout du listener sur la suppression
    let deleteItem = document.querySelectorAll(".deleteItem");
    deleteItem.forEach((deleted) => {
        deleted.addEventListener("click", function(event) {
            event.preventDefault(); 
            // Récupération de l'ID à supprimer
            let deletedProduct = deleted.closest("article");
            // Filtre du localStorage pour ne conserver que les produits non supprimés
            const filtreLocalShopping = localShopping.filter((p) => p.idProduct !== deletedProduct.dataset.id || p.colorProduct !== deletedProduct.dataset.color);
            deletedProduct.remove();
            localStorage.setItem("selectedProduct", JSON.stringify(filtreLocalShopping));
            location.reload();
        })
    })
};



/*// Fonction pour calculer la quantité totale 
function calculateQuantity() {
    let totalQuantity = document.getElementById("totalQuantity");
    let quantity = 0;
    for (let selectedProduct of localShopping) {
        quantity = quantity + JSON.parse(selectedProduct.quantityProduct);
    }
    totalQuantity.innerText = quantity;
};

// Fonction pour calculer le prix total
function calculatePrice() {
    let totalPrice = document.getElementById("totalPrice");
    let price = 0;
    for (let i = 0; i < dataProducts.length; i++) {
        price += dataProducts[i].price * localShopping.quantityProduct;
    }
    totalPrice.innerText = price
};



calculateQuantity();
calculatePrice();*/

console.table(localShopping)

// Formulaire -------------------------------------------

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

// Vérification du formulaire
function validForm() {

     // Déclaration des Regex
    let nameRegex = /^([A-Za-z]{3,20}-{0,1})?([A-Za-z]{3,20})$/;
    let addressRegex = /^(.){2,50}$/;
    let cityRegex = /^[a-zA-Zéèàïêç\-\s]{2,30}$/;
    let emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;  

    // Prénom : Ajout du listener et appel de la fonction de validation
    firstName.focus();
    firstName.addEventListener("change", function(event) {
        event.preventDefault();
        if (nameRegex.test(firstName.value) == false || firstName.value == "") {
            document.getElementById("firstNameErrorMsg").innerText = "Le prénom est un champ obligatoire, veuillez le renseigner sans caractères spéciaux ni chiffres.";
            return false;
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
            return true;
        }
    });

    // Nom : Ajout du listener et appel de la fonction de validation
    lastName.addEventListener("change", function(event) {
        event.preventDefault();
        if (nameRegex.test(lastName.value) == false || lastName.value == "") {
            document.getElementById("lastNameErrorMsg").innerText = "Le nom est un champ obligatoire, veuillez le renseigner sans caractères spéciaux ni chiffres.";
            return false;
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
            return true;
        }
    });

    // Adresse : Ajout du listener et appel de la fonction de validation
    address.addEventListener("change", function(event) {
        event.preventDefault();
        if (addressRegex.test(address.value) == false || address.value == "") {
            document.getElementById("addressErrorMsg").innerText = "L'adresse est un champ obligatoire, veuillez la renseigner (max 50 caractères).";
            return false;
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
            return true;
        }
    });

    // Ville : Ajout du listener et appel de la fonction de validation
    city.addEventListener("change", function(event) {
        event.preventDefault();
        if (cityRegex.test(city.value) == false || city.value == "") {
            document.getElementById("cityErrorMsg").innerText = "La ville est un champ obligatoire, veuillez la renseigner sans caractères spéciaux (max 30 caractères).";
            return false;
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
            return true;
        }
    });

    // Email : Ajout du listener et appel de la fonction de validation
    email.addEventListener("change", function(event) {
        event.preventDefault();
        if (emailRegex.test(email.value) == false || email.value == "") {
            document.getElementById("emailErrorMsg").innerText = "L'email est un champ obligatoire, veuillez le renseigner, exemple : JohnDoe@gmail.fr ";
            return false;
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
            return true;
        }
    });

}

// Validation du formulaire
validForm();

// Enregistrement et envoi de la commande
document.getElementById("order").addEventListener("click", function(event) {
    event.preventDefault();

    // Création de l'objet contact
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    };

    // Création de l'Array qui contiendra l'ID des produits sélectionnés
    let products = [];

    // Création de l'objet contenant l'objet contact et l'Aray products
    let validOrder = { contact, products };

    // Vérification de la complétion du formulaire et du panier
    if (firstName.value === "" || lastName.value === "" || address.value === "" || city.value === "" || email.value === "") {
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
        console.log(validOrder);

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Content-type" : "application/json;charset=utf-8"
            },
            body: JSON.stringify(validOrder)
        })
        .then((response) => response.json())
        .then((confirm) => {
            localStorage.clear();
            window.location.href = "confirmation.html?id=" + confirm.orderId;
        });
    }
});


