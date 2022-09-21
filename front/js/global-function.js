// Fonction pour récupérer les données de l'API pour un Id
/**
* @param { string } id de l'article
* @return { Promise } si ok : JSON des produits, sinon : Error API
*/
async function getOneProduct(id) {
    try {
        const response = await fetch ("http://localhost:3000/api/products/" + id);
        const dataProduct = await response.json();
        return dataProduct;
    } catch(err) {
        console.log("Error API", err);
        alert("Problème technique :(")
    }
};