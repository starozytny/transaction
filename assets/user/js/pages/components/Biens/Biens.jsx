import React, { Component } from "react";

import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";

import { AdCard } from "./AdCard";

export class Biens extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: JSON.parse(props.donnees)
        }
    }

    render () {
        const { data } = this.state;

        console.log(data)

        let items = [];
        data.forEach(el => {
            items.push(<AdCard el={el} status={1} statusName="Actif" key={el.id}/>)
        })

        return <div className="main-content list-biens">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Filtres :</span>
                        </div>
                        <div className="content-col-1">
                            <div>Item</div>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2">
                            <div className="item active">Tous</div>
                            <div className="item">Actif</div>
                            <div className="item">Inactif</div>
                            <div className="item">Brouillon</div>
                            <div className="item">Archive</div>
                        </div>
                        <Button type="primary" element="a" onClick={Routing.generate('user_biens_create')}>Ajouter un bien</Button>
                    </div>
                    <div>
                        {items.length > 0 ? items : <Alert type="info">Aucun résultat.</Alert>}
                    </div>
                </div>
            </div>
        </div>
    }
}