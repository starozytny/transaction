function getItems (type, prefix) {
    switch (type) {
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
                { value: 0, label: 'Nord',          identifiant: 'nord' },
                { value: 1, label: 'Est',           identifiant: 'est' },
                { value: 2, label: 'Sud',           identifiant: 'sud' },
                { value: 3, label: 'Ouest',         identifiant: 'ouest' },
                { value: 4, label: 'Nord-est',      identifiant: 'nord-est' },
                { value: 5, label: 'Nord-ouest',    identifiant: 'nord-ouest' },
                { value: 6, label: 'Sud-est',       identifiant: 'sud-est' },
                { value: 7, label: 'Sud-ouest',     identifiant: 'sud-ouest' },
                { value: 99, label: 'Je ne sais pas', identifiant: 'expo-ne-sais-pas' },
            ]
        case "answers":
            return [
                { value: 1, label: 'Oui',               identifiant: prefix + '-oui' },
                { value: 0, label: 'Non',               identifiant: prefix + '-non' },
                { value: 99, label: 'Je ne sais pas',    identifiant: prefix + '-ne-sais-pas' },
            ]
        case "mandats":
            return [
                { value: 0, label: 'Simple',            identifiant: 'simple' },
                { value: 1, label: 'Exclusif',          identifiant: 'exclusif' },
                { value: 2, label: 'Semi-exclusif',     identifiant: 'semi-exclusif' },
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
                { value: 3, label: "Cession bail",                   identifiant: "cession-bail" },
                { value: 4, label: "Produit d'investissement",       identifiant: "pdt-invest" },
                { value: 5, label: "Location vacances",              identifiant: "location-vac" },
                { value: 6, label: "Vente prestige",                 identifiant: "vente-prestige" },
                { value: 7, label: "Fond de commerce",               identifiant: "fond-commerce" },
            ]
    }
}

module.exports = {
    getItems
}