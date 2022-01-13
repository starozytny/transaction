import React, { Component } from 'react';

import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Button }     from "@dashboardComponents/Tools/Button";

import { VisitsItem } from "./VisitsItem";

export class VisitsList extends Component {
    render () {
        const { isFromRead, data, onChangeContext } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter une visite</Button>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    {isFromRead ? <div className="infos infos-col-2">
                                        <div className="col-1">Visite</div>
                                        <div className="col-2 actions">Actions</div>
                                    </div> : <div className="infos infos-col-4">
                                        <div className="col-1">Visite</div>
                                        <div className="col-2">Personnes</div>
                                        <div className="col-3">Statut</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>}
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