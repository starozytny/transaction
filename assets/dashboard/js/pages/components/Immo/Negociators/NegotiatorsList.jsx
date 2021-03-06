import React, { Component } from 'react';

import { Button, ButtonIcon }       from "@dashboardComponents/Tools/Button";
import { Search }                   from "@dashboardComponents/Layout/Search";
import { Alert }                    from "@dashboardComponents/Tools/Alert";

import { NegotiatorsItem }   from "./NegotiatorsItem";
import {TopSorterPagination} from "@dashboardComponents/Layout/Pagination";

export class NegotiatorsList extends Component {
    render () {
        const { isClient, taille, data, perPage, onChangeContext, onDeleteAll, onSearch, onPerPage,
            onPaginationClick, currentPage, sorters, onSorter } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un négociateur</Button>
                    </div>
                    <div className="item filter-search">
                        <Search onSearch={onSearch} placeholder="Recherche par code, nom, prénom ou email.."/>
                    </div>
                </div>

                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            {!isClient && <div className="item-header-selector" />}
                            <div className="item-content">
                                <div className="item-body item-body-image">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Negociateur</div>
                                        <div className="col-2">Informations</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <NegotiatorsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                {(data && data.length !== 0 && !isClient) && <div className="page-actions">
                    <div className="selectors-actions">
                        <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection" />
                        </div>
                    </div>
                </div>}
            </div>
        </>
    }
}