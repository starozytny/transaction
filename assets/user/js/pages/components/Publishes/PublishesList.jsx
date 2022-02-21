import React, { Component } from 'react';

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";

import { AdCard } from "@userPages/components/Biens/AdCard";

export class PublishesList extends Component {
    render () {
        const { data, onPerPage, onPaginationClick, currentPage, sorters, onSorter, perPage, taille, publishes } = this.props;

        return <>
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Infos :</span>
                        </div>
                        <div className="content-col-1">
                            <div>Item</div>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div>
                        <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                             currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>
                    </div>
                    <div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <AdCard el={elem} isPublishePage={true} publishes={publishes} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}