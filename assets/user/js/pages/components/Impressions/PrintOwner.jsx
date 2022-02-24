import React, { Component } from "react";

import Sanitaze from "@commonComponents/functions/sanitaze";

import { Alert }    from "@dashboardComponents/Tools/Alert";

import { Printer }  from "@userPages/components/Impressions/Printer";

export class PrintOwner extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null,
            biens: props.biens ? JSON.parse(props.biens) : [],
            publishes: props.publishes ? JSON.parse(props.publishes) : [],
        }
    }

    render () {
        const { elem, biens, publishes } = this.state;

        let content = <div className="print-owner">
            <div className="file-date">
                <div>Créé le {(new Date()).toLocaleDateString()}</div>
            </div>
            <div className="file-title">
                <h1>Rapport</h1>
                <div className="subtitle">{elem.fullname}</div>
            </div>
            <div className="file-content">
                {biens.length !== 0 ? biens.map((el, index) => {

                    let historyPublishes = [];
                    publishes.forEach(pub => {
                        if(pub.bien.id === el.id){
                            historyPublishes.push(<div className="publication" key={pub.id}>
                                <div className="time">
                                    <span>{pub.createdAtString}</span>
                                </div>
                                <div className="supports">
                                    {pub.supports.length !== 0 ? pub.supports.map((sup, index) => {
                                        return <div key={index}><span>{sup}</span></div>
                                    }) : "Aucun support sélectionné"}
                                </div>
                            </div>);
                        }
                    })

                    return <div className="item" key={el.id}>
                        <div className="title">Bien ({index + 1} / {biens.length})</div>
                        <div className="content">
                            <Card el={el} />
                        </div>
                        <div className="sub-content">
                            <div className="title">Publications</div>
                            <div className="content">
                                <div className="publications">
                                    {historyPublishes}
                                </div>
                            </div>
                        </div>
                    </div>
                }) : <Alert >Vous n'avez aucun bien actif.</Alert>}
            </div>
        </div>

        return <>
            <Printer content={content}/>
        </>
    }
}

function Card ({ el }) {
    return <div className="print-card-ad">
        <div className="col-1">
            <div className="badges">
                <div className="badge-bien badge">{el.typeBienString}</div>
            </div>
            <div>
                <div className="title">
                    <span>{el.libelle}</span>
                </div>
                <div className="sub">
                    <div>{el.localisation.address}</div>
                    <div>{el.localisation.zipcode}, {el.localisation.city}</div>
                </div>
            </div>
        </div>
        <div className="col-2">
            <div className="badges">
                <div className="badge-bien badge">{el.typeAdString}</div>
                <div className="badge-bien badge">Mandat {el.mandat.typeMandatString}</div>
            </div>
            <div>
                <div className="price">{Sanitaze.toFormatCurrency(el.financial.price)} cc/mois</div>
                <div className="sub">{el.area.habitable}m² - {el.number.room} chambre{el.number.room > 1 ? "s" : ""}</div>
            </div>
        </div>
    </div>
}