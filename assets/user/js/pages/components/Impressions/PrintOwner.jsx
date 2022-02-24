import React, { Component } from "react";

import { Alert }    from "@dashboardComponents/Tools/Alert";

import { Printer }  from "@userPages/components/Impressions/Printer";
import Sanitaze from "@commonComponents/functions/sanitaze";

export class PrintOwner extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null,
            biens: props.biens ? JSON.parse(props.biens) : [],
        }
    }

    render () {
        const { elem, biens } = this.state;

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
                    return <div className="item" key={el.id}>
                        <div className="title">Bien ({index + 1} / {biens.length})</div>
                        <div className="content">
                            <div className="card-ad">
                                <div className="card-main">
                                    <div className="card-body">
                                        <div className="infos">
                                            <div className="col-1">
                                                <div className="badges">
                                                    <div className="badge-bien badge">{el.typeBienString}</div>
                                                </div>
                                                <div className="identifier">
                                                    <div className="title">
                                                        <span>{el.libelle}</span>
                                                    </div>
                                                    <div className="address">
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
                                                <div className="identifier">
                                                    <div className="price">{Sanitaze.toFormatCurrency(el.financial.price)} cc/mois</div>
                                                    <div className="carac">{el.area.habitable}m² - {el.number.room} chambre{el.number.room > 1 ? "s" : ""}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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