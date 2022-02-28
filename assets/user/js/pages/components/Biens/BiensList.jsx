import React, { Component } from 'react';

import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";
import { TopSorterPagination } from "@dashboardComponents/Layout/Pagination";

import { AdCard } from "./AdCard";
import { Filter } from "./Filter";

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
        const { agencyId, dataFilters, pageStatus, data, onDelete, filters, onGetFilters, rapprochements, onUpdateList,
            sorters, onSorter, currentPage, perPage, onPerPage, taille, onPaginationClick, suivis } = this.props;

        let items = [], owners = [], negotiators = [], users = [], noDuplicateOwners = [], noDuplicateNegotiators = [], noDuplicateUsers = [];
        data.forEach(el => {
            items.push(<AdCard el={el} agencyId={agencyId} rapprochements={rapprochements} suivis={suivis}
                               onDelete={onDelete} onUpdateList={onUpdateList} key={el.id}/>)

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
                            <Filter data={dataFilters} onGetFilters={onGetFilters} filters={filters} owners={owners} negotiators={negotiators} users={users}/>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2">
                            <a href={Routing.generate('user_biens')}            className={"item" + (pageStatus === false ? " active" : "")}>Tous</a>
                            <a href={Routing.generate('user_biens', {'st': 1})} className={"item" + (pageStatus === 1 ? " active" : "")}>Actif</a>
                            <a href={Routing.generate('user_biens', {'st': 0})} className={"item" + (pageStatus === 0 ? " active" : "")}>Inactif</a>
                            <a href={Routing.generate('user_biens', {'st': 3})} className={"item" + (pageStatus === 3 ? " active" : "")}>Brouillon</a>
                            <a href={Routing.generate('user_biens', {'st': 2})} className={"item" + (pageStatus === 2 ? " active" : "")}>Archive</a>
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
