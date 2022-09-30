// Fonction pour récupérer les données de l'API pour un Id
/**
* @param { string } id de l'article
* @return { Object } si ok : dataProduct (données du produit dont l'Id est passé en paramètre) , sinon : Error API
*/
async function getOneProduct(id) {
    try {
        const response = await fetch ("http://localhost:3000/api/products/" + id);
        return dataProduct = await response.json();
    } catch(err) {
        console.log("Error API", err);
        alert("Problème technique");
    }
};