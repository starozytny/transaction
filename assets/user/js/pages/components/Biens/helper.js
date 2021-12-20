function getItems (type, prefix) {
    switch (type) {
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
            ]
        case "answers":
            return [
                { value: 1, label: 'Oui',               identifiant: prefix + '-oui' },
                { value: 0, label: 'Non',               identifiant: prefix + '-non' },
                { value: 2, label: 'Je ne sais pas',    identifiant: prefix + '-ne-sais-pas' },
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