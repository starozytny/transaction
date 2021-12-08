import React, { Component } from 'react';

import Sanitaze from "@commonComponents/functions/sanitaze";

function updateTab(initTable, value, newTable) {
    let find = false;
    initTable.forEach(el => {
        if(el === value){
            find = true;
        }
    })

    if(find){
        newTable = initTable.filter(el => { return el !== value });
    }else{
        newTable.push(value);
    }

    return newTable;
}

export class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filtersAd: [0, 1],
            filtersBien: [0, 1, 2, 3],
        }
    }

    handleFilter = (type, value) => {
        const { filtersAd, filtersBien } = this.state;

        let nFiltersAd = filtersAd;
        let nFiltersBien = filtersBien;

        switch (type){
            case "bien":
                nFiltersBien = updateTab(filtersBien, value, nFiltersBien);
                break;
            default:
                nFiltersAd = updateTab(filtersAd, value, nFiltersAd);
                break;
        }

        this.setState({ filtersAd: nFiltersAd, filtersBien: nFiltersBien });
        this.props.onGetFilters([nFiltersAd, nFiltersBien])
    }

    render () {
        const { filtersAd, filtersBien } = this.state;

        let itemsFiltersAd = [
            { value: 0, label: "Vente",                          identifiant: "vente" },
            { value: 1, label: "Location",                       identifiant: "location" },
            { value: 2, label: "Viager",                         identifiant: "viager" },
            { value: 3, label: "Cession bail",                   identifiant: "cession-bail" },
            { value: 4, label: "Produit d'investissement",       identifiant: "pdt-invest" },
            { value: 5, label: "Location vacances",              identifiant: "location-vac" },
            { value: 6, label: "Vente prestige",                 identifiant: "vente-prestige" },
            { value: 7, label: "Fond de commerce",               identifiant: "fond-commerce" },
        ]

        let itemsFiltersBien = [
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

        return <div className="filters">
            <div className="item">
                <div className="title">
                    <span>Annonce</span>
                    <span className="icon-minus" />
                </div>
                <div className="items-filter">
                    {itemsFiltersAd.map(el => {
                        return <div className={"item-filter" + Sanitaze.setActive(filtersAd, el.value)}
                                    key={el.value} onClick={() => this.handleFilter("ad", el.value)}>
                            <div className="box" />
                            <div>{el.label}</div>
                        </div>
                    })}
                </div>
            </div>
            <div className="item">
                <div className="title">
                    <span>Type</span>
                    <span className="icon-minus" />
                </div>
                <div className="items-filter">
                    {itemsFiltersBien.map(el => {
                        return <div className={"item-filter" + Sanitaze.setActive(filtersBien, el.value)}
                                    key={el.value} onClick={() => this.handleFilter("bien", el.value)}>
                            <div className="box" />
                            <div>{el.label}</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}