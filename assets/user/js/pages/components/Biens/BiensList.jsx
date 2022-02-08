import React, { Component } from 'react';

import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";

import { AdCard } from "./AdCard";
import { Filter } from "./Filter";
import {TopSorterPagination} from "@dashboardComponents/Layout/Pagination";

function getItemsSelect (data, noDuplication, el, pref, typeValue = "id") {
    if(el){
        if(!noDuplication.includes(el.id)){
            noDuplication.push(el.id);
            data.push({ value: typeValue === "id" ? el.id : el.username, label: el.fullname, identifiant: pref + "-" + el.id })
        }
    }

    return data;
}

export class BiensList extends Component {
    render () {
        const { dataFilters, pageStatus, pageDraft, data, onDelete, filters, onGetFilters, tenants, onUpdateList,
            sorters, onSorter, currentPage, perPage, onPerPage, taille, onPaginationClick } = this.props;

        let items = [], owners = [], negotiators = [], users = [], noDuplicateOwners = [], noDuplicateNegotiators = [], noDuplicateUsers = [];
        data.forEach(el => {
            items.push(<AdCard el={el} onDelete={onDelete} onUpdateList={onUpdateList} key={el.id}/>)

            owners      = getItemsSelect(owners, noDuplicateOwners, el.owner, "owner");
            negotiators = getItemsSelect(negotiators, noDuplicateNegotiators, el.negotiator, "nego");
            users       = getItemsSelect(users, noDuplicateUsers, el.user, "user", "username");
        })

        return <div className="list-biens">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Filtres :</span>
                        </div>
                        <div className="content-col-1">
                            <Filter data={dataFilters} onGetFilters={onGetFilters} filters={filters}
                                    tenants={tenants} owners={owners} negotiators={negotiators} users={users}/>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2">
                            <div className={"item" + ((pageStatus === false && pageDraft === false) ? " active" : "")}><a href={Routing.generate('user_biens')}>Tous</a></div>
                            <div className={"item" + (pageStatus === 1 ? " active" : "")}><a href={Routing.generate('user_biens', {'st': 1})}>Actif</a></div>
                            <div className={"item" + (pageStatus === 0 ? " active" : "")}><a href={Routing.generate('user_biens', {'st': 0})}>Inactif</a></div>
                            <div className={"item" + (pageDraft === 1 ? " active" : "")}><a href={Routing.generate('user_biens', {'dr': 1})}>Brouillon</a></div>
                            <div className={"item" + (pageStatus === 2 ? " active" : "")}><a href={Routing.generate('user_biens', {'st': 2})}>Archive</a></div>
                        </div>
                        <Button type="primary" element="a" onClick={Routing.generate('user_biens_create')}>Ajouter un bien</Button>
                    </div>
                    <div>
                        <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                             currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>
                    </div>
                    <div>
                        {items.length > 0 ? items : <Alert type="info">Aucun résultat.</Alert>}
                    </div>
                </div>
            </div>
        </div>
    }
}