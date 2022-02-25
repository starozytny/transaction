import React, { Component } from "react";

import { Alert }    from "@dashboardComponents/Tools/Alert";

import { Printer }  from "@userPages/components/Impressions/Printer";
import { Card, Header, HistoriesBien } from "@userPages/components/Impressions/Rapport/Rapport";

export class RapportOwner extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null,
            biens: props.biens ? JSON.parse(props.biens) : [],
            publishes: props.publishes ? JSON.parse(props.publishes) : [],
            visites: props.visites ? JSON.parse(props.visites) : [],
            prices: props.prices ? JSON.parse(props.prices) : [],
        }
    }

    render () {
        const { elem, biens, publishes, visites, prices } = this.state;

        let content = <div className="print-owner">
            <Header subtitle={elem.fullname} />
            <div className="file-content">
                {biens.length !== 0 ? biens.map((el, index) => {

                    return <div className="item" key={el.id}>
                        <div className="title">Bien ({index + 1} / {biens.length})</div>
                        <div className="content">
                            <Card el={el} />
                        </div>
                        <HistoriesBien el={el} publishes={publishes} visites={visites} prices={prices} />
                    </div>
                }) : <Alert>Vous n'avez aucun bien actif.</Alert>}
            </div>
        </div>

        return <>
            <Printer content={content}/>
        </>
    }
}