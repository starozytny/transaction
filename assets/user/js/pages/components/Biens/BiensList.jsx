import React, { Component } from 'react';

import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";

import { AdCard } from "./AdCard";
import { Filter } from "./Filter";

function getItemsSelect (data, noDuplication, el, pref) {
    if(el){
        if(!noDuplication.includes(el.id)){
            noDuplication.push(el.id);
            data.push({ value: el.id, label: el.fullname, identifiant: pref + "-" + el.id })
        }
    }

    return data;
}

export class BiensList extends Component {
    render () {
        const { pageStatus, pageDraft, data, onDelete, filters, onGetFilters, tenants } = this.props;

        let items = [], owners = [], negotiators = [], noDuplicateOwners = [], noDuplicateNegotiators = [];
        data.forEach(el => {
            items.push(<AdCard el={el} onDelete={onDelete} status={1} statusName="Actif" key={el.id}/>)

            owners = getItemsSelect(owners, noDuplicateOwners, el.owner, "owner");
            negotiators = getItemsSelect(negotiators, noDuplicateNegotiators, el.negotiator, "nego");
        })

        return <div className="list-biens">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Filtres :</span>
                        </div>
                        <div className="content-col-1">
                            <Filter onGetFilters={onGetFilters} filters={filters} tenants={tenants} owners={owners} negotiators={negotiators}/>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2">
                            <div className={"item" + ((pageStatus && !pageDraft) ? " active" : "")}><a href={Routing.generate('user_biens')}>Tous</a></div>
                            <div className={"item" + (pageStatus === 1 ? " active" : "")}><a href={Routing.generate('user_biens', {'st': 1})}>Actif</a></div>
                            <div className={"item" + (pageStatus === 0 ? " active" : "")}><a href={Routing.generate('user_biens', {'st': 0})}>Inactif</a></div>
                            <div className={"item" + (pageDraft === 1 ? " active" : "")}><a href={Routing.generate('user_biens', {'dr': 1})}>Brouillon</a></div>
                            <div className={"item" + (pageStatus === 2 ? " active" : "")}><a href={Routing.generate('user_biens', {'st': 2})}>Archive</a></div>
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