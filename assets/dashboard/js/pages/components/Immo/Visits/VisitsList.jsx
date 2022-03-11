import React, { Component } from 'react';

import Routing        from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Button }     from "@dashboardComponents/Tools/Button";

import { VisitsItem } from "./VisitsItem";

export class VisitsList extends Component {
    render () {
        const { isSuiviPage=true, data, onChangeContext } = this.props;

        return <>
            <div>
                {isSuiviPage && <>
                    <div className="toolbar toolbar-suivi">
                        <div className="item create">
                            <Button onClick={() => onChangeContext("create")}>Ajouter une visite</Button>
                        </div>
                        <div className="item create">
                            <Button icon="file" type="default" element="a" target="_blank" onClick={Routing.generate('api_visits_document_bon', {'id': 'generique'})}>Bon de visite</Button>
                        </div>
                        <div className="item create">
                            <Button icon="file" type="default" element="a" target="_blank" onClick={Routing.generate('api_visits_document_bon', {'id': 'generique'})}>Bon de visite délégué</Button>
                        </div>
                    </div>
                </>}

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Visite</div>
                                        <div className="col-2">Personnes</div>
                                        <div className="col-3">Statut</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <VisitsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}
