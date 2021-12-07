import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";
import { AdCard } from "../Styleguide/components/StyleguideCard";

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

        return <div className="main-content">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="comeback">
                        <Button type="reverse" onClick="/">Retour à la liste</Button>
                    </div>
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
                        <Button type="primary">Ajouter un bien</Button>
                    </div>
                    <form>
                        <AdCard status={1} statusName="Actif"/>
                    </form>
                </div>
            </div>
        </div>
    }
}