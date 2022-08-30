// Récupération de l'ID de la commande dans le lien
let orderId = new URL(window.location.href).searchParams.get("id");

// Affichage du numéro de commande
let order = document.getElementById("orderId");
order.innerText = orderId;