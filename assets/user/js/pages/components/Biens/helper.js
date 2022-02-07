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
                { value: 1, label: 'TVA/Loyer + Charges',                       identifiant: 'tva-l-c' },
                { value: 2, label: 'TVA/Loyer + Charges + Ordures ménagères',   identifiant: 'tva-l-c-o' },
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
        case "answers-search":
            return [
                { value: 1, label: 'Oui',               identifiant: 'answer-' + prefix + '-oui' },
                { value: 0, label: 'Non',               identifiant: 'answer-' + prefix + '-non' },
                { value: 99, label: 'Indifférent',      identifiant: 'answer-' + prefix + '-ok' },
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

function getRightPhoneBien(agency, codeTypeAd){
    if(codeTypeAd === 1){
        return agency.phoneLocation ? agency.phoneLocation : agency.phone;
    }

    return agency.phoneVente ? agency.phoneVente : agency.phone;
}

function getRightEmailBien(agency, codeTypeAd){
    if(codeTypeAd === 1){
        return agency.emailLocation ? agency.emailLocation : agency.phone;
    }

    return agency.emailVente ? agency.emailVente : agency.phone;
}

function selectToString (tab, value) {
    let label = "";
    tab.forEach(item => {
        if(item.value === value){
            label = item.label
        }
    })

    return label;
}

function setContentFull(self){
    const { quartier, codeTypeBien, codeTypeAd, piece, areaHabitable, areaTerrace, areaGarden, parking, box,
        room, bathroom, balcony, wc, exposition, codeHeater0, codeHeater, codeKitchen, isWcSeparate,
        hasPool, hasCave, hasClim, hasInternet, hasGuardian, hasAlarme, hasDigicode, hasInterphone } = self.state;

    let cTypeBien       = parseInt(codeTypeBien);
    let cTypeAd         = parseInt(codeTypeAd);
    let cPiece          = parseInt(piece);
    let cParking        = parseInt(parking);
    let cBox            = parseInt(box);
    let cRoom           = parseInt(room);
    let cBathroom       = parseInt(bathroom);
    let cBalcony        = parseInt(balcony);
    let cWc             = parseInt(wc);
    let cExposition     = parseInt(exposition);
    let cIsWcSeparate   = parseInt(isWcSeparate);
    let cHasPool        = parseInt(hasPool);
    let cHasCave        = parseInt(hasCave);
    let cHasClim        = parseInt(hasClim);
    let cHasInternet    = parseInt(hasInternet);
    let cHasGuardian    = parseInt(hasGuardian);
    let cHasAlarme      = parseInt(hasAlarme);
    let cHasDigicode    = parseInt(hasDigicode);
    let cHasInterphone  = parseInt(hasInterphone);

    let typeAdItems     = getItems("ads");
    let typeBienItems   = getItems("biens");
    let expositionItems = getItems("expositions");
    let chauffage0Items = getItems("chauffages-0");
    let chauffage1Items = getItems("chauffages-1");
    let cuisineItems    = getItems("cuisines");

    let typeBienString      = cTypeBien === 9 ? "bien" : selectToString(typeBienItems, cTypeBien).toLowerCase();
    let typeAdString        = selectToString(typeAdItems, cTypeAd);
    let expositionString    = selectToString(expositionItems, exposition).toLowerCase();
    let heater0String       = selectToString(chauffage0Items, codeHeater0).toLowerCase();
    let heaterString        = selectToString(chauffage1Items, codeHeater).toLowerCase();
    let kitchenString       = selectToString(cuisineItems, codeKitchen).toLowerCase();

    let pre0, pre1, secure;
    switch (cTypeBien){
        case 2: case 3: case 5: case 6: case 8: case 9:
            pre1 = "Ce "
            secure = "sécurisé"
            break;
        case 1: case 4:
            pre0 = "une "
            pre1 = "Cette "
            secure = "sécurisée"
            break;
        default:
            pre0 = "un "
            pre1 = "Cet"
            secure = "sécurisé"
            break;
    }

    let textParking = cParking > 0 && cBox > 0 ? "un parking/box" : (cParking > 0 ? "un parking" : cBox > 0 ? "un box": "")

    let content = quartier ? "A proximité de " + quartier + ", n" : "N";
    content += "ous vous proposons "
        + pre0 + typeBienString
        + (cTypeBien !== 2 && cTypeBien !== 3 ? " de " + cPiece + " pièce" + (cPiece > 1 ? "s" : "") : "")
        + (cTypeAd === 0 || cTypeAd === 1 ? " à la " : " en ") + typeAdString.toLowerCase()
        + " de " + areaHabitable + "m²"
        + (parseFloat(areaTerrace) > 0 ? " avec une terrasse de " + areaTerrace + "m²" : "")
        + (parseFloat(areaTerrace) > 0 ? " et " : " avec ") + textParking
        + ". \n"
    ;

    if(parseFloat(areaGarden) > 0 || cPiece > 0 || cRoom > 0 || cBalcony > 0 || cBathroom > 0 || cWc > 0){
        content += pre1 + typeBienString + (parseFloat(areaGarden) > 0 ? " dispose d'un jardin de " + areaGarden + "m² et" : "")
            + " comporte "
            + numberString(cPiece, "piece")
            + (cPiece > 0 && cRoom > 0 ? ", " : "") + numberString(cRoom, "chambre")
            + ((cPiece > 0 || cRoom > 0) && cBalcony > 0 ? ", " : "") + numberString(cBalcony, "balcon")
            + ((cPiece > 0 || cRoom > 0 || cBalcony > 0) && cBathroom > 0 ? ", " : "") + numberString(cBathroom, "salle") + (cBathroom > 0 ? " de bain" : "")
            + ((cPiece > 0 || cRoom > 0 || cBalcony > 0 || cBathroom > 0) && cWc > 0 ? " et " : "") + numberString(cWc, "WC", "")
            + ".\n"
        ;
    }

    if(cExposition !== 99 || cHasPool === 1 || cHasCave === 1 || cHasClim === 1 ||  cHasInternet === 1 || cIsWcSeparate === 1){
        content += "Ce bien" + (cExposition !== 99 ? ", exposé " + expositionString : "")
            + (cExposition !== 99 ? "," : "") + " a l'avantage de posséder "
            + advantageString(cHasPool, "une piscine")
            + (cHasPool === 1 && cHasCave === 1 ? ", " : "") + advantageString(cHasCave, "une cave")
            + ((cHasPool === 1 || cHasCave === 1) && cHasClim === 1 ? ", " : "") + advantageString(cHasClim, "une climatisation")
            + ((cHasPool === 1 || cHasCave === 1 || cHasClim === 1) && cHasInternet === 1 ? ", " : "") + advantageString(cHasInternet, "une connexion internet")
            + ((cHasPool === 1 || cHasCave === 1 || cHasClim === 1 || cHasInternet === 1) && cIsWcSeparate === 1 ? " et " : "")
            + advantageString(cIsWcSeparate, " de WC séparé")
            +  ".\n"
        ;
    }

    if(cHasGuardian === 1 || cHasAlarme === 1 || cHasDigicode === 1 || cHasInterphone === 1){
        content += "De plus, " + pre1.toLowerCase() + typeBienString
            + " est " + secure + " grâce à la présence d'"
            + advantageString(cHasGuardian, "un gardien")
            + (cHasGuardian === 1 && cHasAlarme === 1 ? ", " : "") + advantageString(cHasAlarme, "une alarme")
            + ((cHasGuardian === 1 || cHasAlarme === 1) && cHasDigicode === 1 ? ", " : "") + advantageString(cHasDigicode, "un digicode")
            + ((cHasGuardian === 1 || cHasAlarme === 1 || cHasDigicode === 1) && cHasInterphone === 1 ? " et " : "") + advantageString(cHasInterphone, "un interphone")
            + "."
        ;
    }


    return content;
}

function advantageString(value, text) {
    return value === 1 ? text : ""
}

function numberString(value, text, plurial = "s") {
    return value > 0 ? value + " " + text + (value > 1 ? plurial : "") : "";
}

module.exports = {
    getItems,
    addOrRemove,
    getIntValue,
    getRightPhoneBien,
    getRightEmailBien,
    setContentFull,
    selectToString
}