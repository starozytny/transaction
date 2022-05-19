import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Alert }                from "@dashboardComponents/Tools/Alert";
import { AdCard }               from "@userPages/components/Biens/AdCard";
import { PageInfos2 }           from "@userComponents/Layout/Page";
import { Button }               from "@dashboardComponents/Tools/Button";
import { TopSorterPagination }  from "@dashboardComponents/Layout/Pagination";

export class PublishesList extends Component {
    render () {
        const { isUser, data, onPerPage, onPaginationClick, currentPage, sorters, onSorter, perPage, taille,
            publishes, onPublish, toPublishes, onSelect } = this.props;

        let actionsPublish = <Button onClick={onPublish}>Envoyer</Button>
        let actionsPrinter = <>
            <Button element="a" target="_blank" onClick={Routing.generate('user_printer_biens_display', {'ori': 'landscape'})}>Paysage</Button>
            <Button element="a" target="_blank" onClick={Routing.generate('user_printer_biens_display', {'ori': 'portrait'})} outline={true}>Portrait</Button>
        </>

        return <>
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        {!isUser && <div className="content-col-1">
                            <PageInfos2 image="/build/user/images/publish.png" actions={actionsPublish}>
                                <p>
                                    Lancer la publication permet d'envoyer les données vers les différents supports qui
                                    se chargeront eux-même de mettre à jours leurs données.
                                </p>
                            </PageInfos2>
                        </div>}

                        <div className="content-col-1">
                            <PageInfos2 image="/build/user/images/display_bien.png" actions={actionsPrinter}>
                                <p>
                                    Les boutons ci-dessous permettent d'imprimer l'ensemble des annonces actives.
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
                            return <AdCard el={elem} isPublishePage={true} publishes={publishes} toPublishes={toPublishes} onSelectPublish={onSelect} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}
