let localShopping = JSON.parse(localStorage.getItem("selectedProduct")); 

// Fonction pour trier les articles du localStorage
localShopping.sort(function (a, b) {
    if (a.nameProduct < b.nameProduct)
    return -1;
    if (a.nameProduct > b.nameProduct)
    return 1;
return 0;
});

// Fonction pour générer la liste des produits présents dans le panier
async function generateShopping() {
    
    // Création des fiches des produits présents dans le localStorage
    for (let selectedProduct in localShopping) {
        // Récupération des données de l'API pour les produits du localStorage
        await fetch ("http://localhost:3000/api/products/" + localShopping[selectedProduct].idProduct)
        .then(res => res.json())
        .then(JSON => dataProducts = JSON)
        .catch(err => console.log("Error API", err));

        // Récupération de l'élément du DOM qui accueillera les fiches
        const listProducts = document.getElementById("cart__items");

        // Création des balises articles
        const Product = document.createElement ("article");
        Product.className = "cart__item";
        listProducts.appendChild(Product);

         // Création de l'élément div pour l'image
         const imageContainer = document.createElement ("div");
         imageContainer.className = "cart__item__img";
         Product.appendChild(imageContainer);

        // Création des images avec leur URL et attributs Alt
        const imageProduct = document.createElement("img");
        imageProduct.src = dataProducts.imageUrl;
        imageProduct.setAttribute("alt", dataProducts.altTxt);
        imageContainer.appendChild(imageProduct);

        // Création de l'élément div pour le détail du produit
        const contentProduct = document.createElement ("div");
        contentProduct.className = "cart__item__content";
        Product.appendChild(contentProduct);

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

        // Fonction pour calculer de la quantité totale 
        function calculateQuantity() {
            let totalQuantity = document.getElementById("totalQuantity");
            let quantity = 0;
            for (let selectedProduct of localShopping) {
                quantity += JSON.parse(selectedProduct.quantityProduct);
            }
            totalQuantity.innerText = quantity;
        };
        calculateQuantity();

        // Fonction pour calculer le prix total
        function calculatePrice() {
            let totalPrice = document.getElementById("totalPrice");
            let price = 0;
            for ( i = 0; i < dataProducts.length; ++i) {
                price += dataProducts[i].price * localShopping.quantityProduct;
            }
            totalPrice.innerText = price;
        };
        calculatePrice();

        console.table(localShopping)
    }
};

// Génération de la liste des produits dans le panier
generateShopping();





