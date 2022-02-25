import React, { Component } from "react";

import parse from "html-react-parser";

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
            visites: props.visites ? JSON.parse(props.visites) : [],
            prices: props.prices ? JSON.parse(props.prices) : [],
        }
    }

    render () {
        const { elem, biens, publishes, visites, prices } = this.state;

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

                    let historyPrices    = history('prices', prices, el);
                    let historyVisites   = history('visites', visites, el);
                    let historyPublishes = history('publishes', publishes, el);

                    return <div className="item" key={el.id}>
                        <div className="title">Bien ({index + 1} / {biens.length})</div>
                        <div className="content">
                            <Card el={el} />
                        </div>
                        <div className="sub-content">
                            <div className="title">Publications</div>
                            <div className="content">
                                <div className="items">
                                    {historyPublishes.length !== 0 ? historyPublishes : <Alert>Aucune publication enregistrée.</Alert>}
                                </div>
                            </div>
                        </div>
                        <div className="sub-content">
                            <div className="title">Visites</div>
                            <div className="content">
                                <div className="items">
                                    {historyVisites.length !== 0 ? historyVisites : <Alert>Aucune visite enregistrée.</Alert>}
                                </div>
                            </div>
                        </div>
                        <div className="sub-content">
                            <div className="title">Prix</div>
                            <div className="content">
                                <div className="items">
                                    {historyPrices.length !== 0 ? historyPrices : <Alert>Aucun prix enregistré.</Alert>}
                                </div>
                            </div>
                        </div>
                    </div>
                }) : <Alert>Vous n'avez aucun bien actif.</Alert>}
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

function history (type, data, el) {
    let histories = [];
    data.forEach(elem => {
        if(elem.bienId === el.id){
            let content = null;
            switch (type){
                case "prices":
                    content = <Price elem={elem} el={el} key={elem.id} />
                    break;
                case "visites":
                    content = <Visite elem={elem} key={elem.id} />;
                    break;
                case "publishes":
                    content = <Publication elem={elem} key={elem.id}/>;
                    break;
                default:
                    break;
            }

            if(content){
                histories.push(content);
            }

        }
    })

    return histories;
}

function Publication ({ elem }) {
    return <div className="history">
        <div className="time">
            <span>{elem.createdAtString}</span>
        </div>
        <div className="infos supports">
            {elem.supports.length !== 0 ? elem.supports.map((sup, index) => {
                return <div key={index}><span>{sup}</span></div>
            }) : "Aucun support sélectionné"}
        </div>
    </div>
}

function Visite ({ elem }) {
    return <div className="history">
        <div className="time">
            <span>{parse(elem.fullDate)}</span>
        </div>
        <div className="infos">
            <span className={"badge badge-" + elem.status}>{elem.statusString}</span>
            <span>{elem.name} {elem.location ? "à " + elem.location : null}</span>
        </div>
    </div>
}

function Price ({ elem, el }) {
    return <div className="history">
        <div className="time">
            <span>{elem.createdAtString}</span>
        </div>
        <div className="infos">
            <span>{Sanitaze.toFormatCurrency(elem.price)} {el.codeTypeAd === 1 ? "cc/mois" : ""}</span>
        </div>
    </div>
}