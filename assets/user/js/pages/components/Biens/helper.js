const toastr = require("toastr");

function getItems (type, prefix) {
    switch (type) {
        case "rooms":
            return [
                { value: 0, label: 'Autre',             identifiant: 'r-other' },
                { value: 1, label: 'Balcon',            identifiant: 'r-balcony' },
                { value: 2, label: 'Box',               identifiant: 'r-box' },
                { value: 3, label: 'Cave',              identifiant: 'r-cave' },
                { value: 4, label: 'Chambre',           identifiant: 'r-room' },
                { value: 5, label: 'Cuisine',           identifiant: 'r-kitchen' },
                { value: 6, label: 'Jardin',            identifiant: 'r-garden' },
                { value: 7, label: 'Parking',           identifiant: 'r-parking' },
                { value: 8, label: 'Salle à manger',    identifiant: 'r-sdm' },
                { value: 9, label: 'Salle de bain',     identifiant: 'r-sde' },
                { value: 10, label: 'Salon',            identifiant: 'r-salon' },
                { value: 11, label: 'Terrasse',         identifiant: 'r-terrace' },
                { value: 12, label: 'WC',               identifiant: 'r-wc' },
            ];
        case "adverts":
            return [
                { value: 0, label: 'Classique',       identifiant: 'classique' },
                { value: 1, label: 'Bonne affaire',   identifiant: 'bonne-affaire' },
                { value: 2, label: 'Coup de coeur',   identifiant: 'heart' },
            ];
        case "informs":
            return [
                { value: 0, label: 'Personne',       identifiant: 'inform-nobody' },
                { value: 1, label: 'Propriétaire',   identifiant: 'inform-owner' },
                { value: 2, label: 'Locataire(s)',   identifiant: 'inform-tenant' },
                { value: 3, label: 'Autres',         identifiant: 'inform-others' },
            ];
        case "occupations":
            return [
                { value: 0, label: 'Libre',                   identifiant: 'libre' },
                { value: 1, label: 'Occupé - propriétaire',   identifiant: 'busy-owner' },
                { value: 2, label: 'Occupé - locataire(s)',   identifiant: 'busy-tenants' },
            ];
        case "honoraires":
            return [
                { value: 0, label: 'Acquéreur',             identifiant: 'acquereur' },
                { value: 1, label: 'Vendeur',               identifiant: 'vendeur' },
                { value: 2, label: 'Acquéreur et vendeur',  identifiant: 'acquereur-vendeur' },
            ];
        case "sols":
            return [
                { value: 0, label: 'Carrelage',             identifiant: 'carrelage' },
                { value: 1, label: 'Moquette',              identifiant: 'moquette' },
                { value: 2, label: 'Moquette + carrelage',  identifiant: 'moquette-carrelage' },
                { value: 3, label: 'Parquet',               identifiant: 'parquet' },
                { value: 4, label: 'Synthétique',           identifiant: 'synthetique' },
                { value: 5, label: 'Tomette',               identifiant: 'tomette' },
            ];
        case "bails":
            return [
                { value: 0, label: 'Habitation',     identifiant: 'habitation' },
                { value: 1, label: 'Commercial',     identifiant: 'commercial' },
                { value: 2, label: 'Meublé',         identifiant: 'meublé' },
                { value: 3, label: 'Professionnel',  identifiant: 'professionnel' },
                { value: 4, label: 'Garage',         identifiant: 'garage' },
            ];
        case "charges":
            return [
                { value: 0, label: 'Forfaitaires mensuelles',     identifiant: 'charges-fo' },
                { value: 1, label: 'Prévisionnelles mensuelles avec régularisation annuelle',  identifiant: 'regularisation' },
                { value: 2, label: 'Remboursement annuel par le locataire',     identifiant: 'remboursement' },
            ];
        case "calculs":
            return [
                { value: 0, label: 'Pas de taxe',                               identifiant: 'no-taxe' },
                { value: 1, label: 'TVA/Loyer',                                 identifiant: 'tva-l' },
                { value: 2, label: 'TVA/Loyer + Ordures ménagères',             identifiant: 'tva-l-o' },
                { value: 3, label: 'TVA/Loyer + Ordures ménagères + Charges',   identifiant: 'tva-l-o-c' },
            ];
        case "diags":
            return [
                { value: 0, label: 'A', identifiant: 'diag-' + prefix + '-a' },
                { value: 1, label: 'B', identifiant: 'diag-' + prefix + '-b' },
                { value: 2, label: 'C', identifiant: 'diag-' + prefix + '-c' },
                { value: 3, label: 'D', identifiant: 'diag-' + prefix + '-d' },
                { value: 4, label: 'E', identifiant: 'diag-' + prefix + '-e' },
                { value: 5, label: 'F', identifiant: 'diag-' + prefix + '-f' },
                { value: 6, label: 'G', identifiant: 'diag-' + prefix + '-g' },
            ];
        case "cuisines":
            return [
                { value: 0, label: 'Aucune',               identifiant: 'aucune' },
                { value: 1, label: 'Américaine',           identifiant: 'américaine' },
                { value: 2, label: 'Séparée',              identifiant: 'separee' },
                { value: 3, label: 'Industrielle',         identifiant: 'industrielle' },
                { value: 4, label: 'Coin cuisine',         identifiant: 'coin-cuisine' },
                { value: 5, label: 'Américaine équipée',   identifiant: 'américaine-equipee' },
                { value: 6, label: 'Séparée équipée',      identifiant: 'separee-equipee' },
                { value: 7, label: 'Coin cuisine équipé',  identifiant: 'coin-cuisine-equipe' },
                { value: 8, label: 'Equipée',              identifiant: 'equipee' },
            ];
        case "water":
        case "chauffages-0":
            return [
                { value: 0, label: 'Collectif',  identifiant: 'collectif' },
                { value: 1, label: 'Individuel', identifiant: 'individuel' },
            ]
        case "chauffages-1":
            return [
                { value: 0, label: 'Radiateur',                 identifiant: 'radiateur' },
                { value: 1, label: 'Sol',                       identifiant: 'sol' },
                { value: 2, label: 'Mixte',                     identifiant: 'mixte' },
                { value: 3, label: 'Gaz',                       identifiant: 'gaz' },
                { value: 4, label: 'Gaz radiateur',             identifiant: 'gaz-radiateur' },
                { value: 5, label: 'Gaz sol',                   identifiant: 'gaz-sol' },
                { value: 6, label: 'Gaz mixte',                 identifiant: 'gaz-mixte' },
                { value: 7, label: 'Fuel',                      identifiant: 'fuel' },
                { value: 8, label: 'Fuel radiateur',            identifiant: 'fuel-radiateur' },
                { value: 9, label: 'Fuel sol',                  identifiant: 'fuel-sol' },
                { value: 10, label: 'Fuel mixte',               identifiant: 'fuel-mixte' },
                { value: 11, label: 'Electrique',               identifiant: 'electrique' },
                { value: 12, label: 'Electrique radiateur',     identifiant: 'electrique-radiateur' },
                { value: 13, label: 'Electrique sol',           identifiant: 'electrique-sol' },
                { value: 14, label: 'Electrique mixte',         identifiant: 'electrique-mixte' },
                { value: 15, label: 'Climatisation réversible', identifiant: 'climatisation-reversible' },
            ];
        case "expositions":
            return [
                { value: 0, label: 'Nord',            identifiant: 'nord' },
                { value: 1, label: 'Est',             identifiant: 'est' },
                { value: 2, label: 'Sud',             identifiant: 'sud' },
                { value: 3, label: 'Ouest',           identifiant: 'ouest' },
                { value: 4, label: 'Nord-est',        identifiant: 'nord-est' },
                { value: 5, label: 'Nord-ouest',      identifiant: 'nord-ouest' },
                { value: 6, label: 'Sud-est',         identifiant: 'sud-est' },
                { value: 7, label: 'Sud-ouest',       identifiant: 'sud-ouest' },
                { value: 99, label: 'Je ne sais pas', identifiant: 'expo-ne-sais-pas' },
            ]
        case "answers":
            return [
                { value: 1, label: 'Oui',               identifiant: 'answer-' + prefix + '-oui' },
                { value: 0, label: 'Non',               identifiant: 'answer-' + prefix + '-non' },
                { value: 99, label: 'Je ne sais pas',   identifiant: 'answer-' + prefix + '-ne-sais-pas' },
            ]
        case "answers-simple":
            return [
                { value: 1, label: 'Oui',               identifiant: 'answer-simple-' + prefix + '-oui' },
                { value: 0, label: 'Non',               identifiant: 'answer-simple-' + prefix + '-non' },
            ]
        case "mandats":
            return [
                { value: 0, label: 'Aucun',             identifiant: 'mandat-none' },
                { value: 1, label: 'Simple',            identifiant: 'simple' },
                { value: 2, label: 'Exclusif',          identifiant: 'exclusif' },
                { value: 3, label: 'Semi-exclusif',     identifiant: 'semi-exclusif' },
            ];
        case "biens":
            return [
                { value: 0, label: 'Appartement',       identifiant: 'appartement' },
                { value: 1, label: 'Maison',            identifiant: 'maison' },
                { value: 2, label: 'Parking/Box',       identifiant: 'parking-box' },
                { value: 3, label: 'Terrain',           identifiant: 'terrain' },
                { value: 4, label: 'Boutique',          identifiant: 'boutique' },
                { value: 5, label: 'Bureau',            identifiant: 'bureau' },
                { value: 6, label: 'Château',           identifiant: 'chateau' },
                { value: 7, label: 'Immeuble',          identifiant: 'immeuble' },
                { value: 8, label: 'Terrain + Maison',  identifiant: 'terrain-maison' },
                { value: 9, label: 'Divers',            identifiant: 'divers' },
            ];
        default:
            return [
                { value: 0, label: "Vente",                          identifiant: "vente" },
                { value: 1, label: "Location",                       identifiant: "location" },
                { value: 2, label: "Viager",                         identifiant: "viager" },
                { value: 3, label: "Produit d'investissement",       identifiant: "pdt-invest" },
                { value: 4, label: "Cession bail",                   identifiant: "cession-bail" },
                { value: 5, label: "Location vacances",              identifiant: "location-vac" },
                { value: 6, label: "Vente prestige",                 identifiant: "vente-prestige" },
                { value: 7, label: "Fond de commerce",               identifiant: "fond-commerce" },
            ]
    }
}

function addOrRemove(data, el, txtAdd="", txtRemove="", isUpdate=false, txtUpdate=""){
    let find = false;
    let newData = [];
    data.forEach(item => {
        if((item.id && item.id === el.id) || (item.uid && item.uid === el.uid)){
            find = true;
        }else{
            newData.push(item);
        }
    })

    if(!find){
        newData = data;
        newData.push(el);
        toastr.info(txtAdd);
    }else{
        if(isUpdate){
            newData.push(el);
            toastr.info(txtUpdate);
        }else{
            toastr.info(txtRemove);
        }
    }

    return newData;
}

function getIntValue(value){
    return value !== "" ? parseInt(value) : "";
}

module.exports = {
    getItems,
    addOrRemove,
    getIntValue
}