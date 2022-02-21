import React, { Component } from 'react';

import { Alert }                from "@dashboardComponents/Tools/Alert";
import { AdCard }               from "@userPages/components/Biens/AdCard";
import { PageInfos2 }           from "@userComponents/Layout/Page";
import { Button }               from "@dashboardComponents/Tools/Button";
import { TopSorterPagination }  from "@dashboardComponents/Layout/Pagination";


export class PublishesList extends Component {
    render () {
        const { data, onPerPage, onPaginationClick, currentPage, sorters, onSorter, perPage, taille, publishes } = this.props;

        let actions = <Button>Envoyer</Button>

        return <>
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="content-col-1">
                            <PageInfos2 image="/build/user/images/publish.png" actions={actions}>
                                <p>
                                    Lancer la publication permet d'envoyer les données vers les différents supports qui
                                    se chargeront eux-même de mettre à jours leurs données.
                                </p>
                            </PageInfos2>
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