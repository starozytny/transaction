import React, { Component } from 'react';

import { Alert }                from "@dashboardComponents/Tools/Alert";
import { TopSorterPagination }  from "@dashboardComponents/Layout/Pagination";

export class PublishesHistoriesList extends Component {
    render () {
        const { data, onPerPage, onPaginationClick, currentPage, sorters, onSorter, perPage, taille } = this.props;

        return <>
            <div>
                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille}
                                     onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Publication</div>
                                        <div className="col-2">Nombre de biens</div>
                                        <div className="col-3 actions" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <div className="item" key={elem.id}>
                                <div className="item-content">
                                    <div className="item-body">
                                        <div className="infos infos-col-3">
                                            <div className="col-1">
                                                <div className="name">
                                                    <span>{elem.publishedAtString}</span>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                {elem.nbBiens}
                                            </div>
                                            <div className="col-3 actions" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}
