import React, { Component } from 'react';

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Search }                 from "@dashboardComponents/Layout/Search";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";

import { SupportsItem }   from "./SupportsItem";

export class SupportsList extends Component {
    render () {
        const { data, onSearch, onPerPage, onPaginationClick, currentPage, sorters, onSorter, perPage, taille } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item filter-search">
                        <Search onSearch={onSearch} placeholder="Recherche par nom de support"/>
                    </div>
                </div>

                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Support</div>
                                        <div className="col-2">Informations</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <SupportsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}