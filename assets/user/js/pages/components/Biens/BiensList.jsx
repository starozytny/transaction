import React, { Component } from 'react';

import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";

import { AdCard } from "./AdCard";

export class BiensList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterAd: 0
        }
    }

    handleFilter = (type, value) => {
        const { filterAd } = this.state;

        let nFilterAd = filterAd;

        switch (type){
            default:
                nFilterAd = filterAd === value ? "" : value;
                break;
        }

        this.setState({ filterAd: nFilterAd });
        this.props.onGetFilters([nFilterAd])
    }

    render () {
        const { data, onDelete } = this.props;
        const { filterAd } = this.state;

        let filtersAd = [
            {value: 0, label: "Vente",                          identifiant: "vente"},
            {value: 1, label: "Location",                       identifiant: "location"},
            {value: 2, label: "Viager",                         identifiant: "viager"},
            {value: 3, label: "Cession bail",                   identifiant: "cession-bail"},
            {value: 4, label: "Produit d'investissement",       identifiant: "pdt-invest"},
            {value: 5, label: "Location vacances",              identifiant: "location-vac"},
            {value: 6, label: "Vente prestige",                 identifiant: "vente-prestige"},
            {value: 7, label: "Fond de commerce",               identifiant: "fond-commerce"},
        ]

        let items = [];
        data.forEach(el => {
            items.push(<AdCard el={el} onDelete={onDelete} status={1} statusName="Actif" key={el.id}/>)
        })


        return <div className="main-content list-biens">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Filtres :</span>
                        </div>
                        <div className="content-col-1">
                            <div className="filters">
                                <div className="item">
                                    <div className="title">
                                        <span>Annonce</span>
                                        <span className="icon-minus" />
                                    </div>
                                    <div className="items-filter items-filters-radio">
                                        {filtersAd.map(el => {
                                            return <div className={"item-filter" + (filterAd === el.value ? " active" : "")}
                                                        key={el.value} onClick={() => this.handleFilter("ad", el.value)}>
                                                <div className="radio" />
                                                <div>{el.label}</div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2">
                            <div className="item active">Tous</div>
                            <div className="item">Actif</div>
                            <div className="item">Inactif</div>
                            <div className="item">Brouillon</div>
                            <div className="item">Archive</div>
                        </div>
                        <Button type="primary" element="a" onClick={Routing.generate('user_biens_create')}>Ajouter un bien</Button>
                    </div>
                    <div>
                        {items.length > 0 ? items : <Alert type="info">Aucun résultat.</Alert>}
                    </div>
                </div>
            </div>
        </div>
    }
}