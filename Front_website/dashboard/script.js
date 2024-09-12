function updateBar() {
    // Récupérer la quantité entrée
    let quantite = document.getElementById("quantiteInput").value;
    
    // Limiter la quantité entre 0 et 100
    if (quantite < 0) quantite = 0;
    if (quantite > 100) quantite = 100;
    
    // Sélectionner la barre et ajuster la hauteur en pourcentage
    let barre = document.getElementById("barre");
    barre.style.height = quantite + "%";
    
    // Changer la couleur selon la quantité
    if (quantite > 50) {
        barre.style.backgroundColor = "green";
    } else if (quantite > 20) {
        barre.style.backgroundColor = "orange";
    } else {
        barre.style.backgroundColor = "red";
    }
}
