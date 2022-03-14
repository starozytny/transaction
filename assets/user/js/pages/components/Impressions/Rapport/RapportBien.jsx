import React, { Component } from "react";

import { Printer }  from "@userPages/components/Impressions/Printer";
import { Card, Header, HistoriesBien } from "@userPages/components/Impressions/Rapport/Rapport";

export class RapportBien extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null,
            elements: props.elements ? JSON.parse(props.elements) : [],
            publishes: props.publishes ? JSON.parse(props.publishes) : [],
            visites: props.visites ? JSON.parse(props.visites) : [],
            prices: props.prices ? JSON.parse(props.prices) : [],
        }
    }

    render () {
        const { elem, elements, publishes, visites, prices } = this.state;

        let content = <div className="print-owner">
            <Header subtitle={elem.libelle} />
            <div className="file-content">
                <div className="item">
                    <div className="title">Informations</div>
                    <div className="content">
                        <Card el={elem} />
                    </div>
                    <HistoriesBien el={elem} elements={elements} publishes={publishes} visites={visites} prices={prices} />
                </div>
            </div>
        </div>

        return <>
            <Printer content={content}/>
        </>
    }
}
