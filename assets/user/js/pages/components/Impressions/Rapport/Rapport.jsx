import React from "react";

import parse from "html-react-parser";

import Sanitaze from "@commonComponents/functions/sanitaze";

import { Alert } from "@dashboardComponents/Tools/Alert";
import {Selector} from "@dashboardComponents/Layout/Selector";
import {ButtonIcon} from "@dashboardComponents/Tools/Button";

export function Header ({ title="Rapport", subtitle }) {
    return <>
        <div className="file-date">
            <div>Créé le {(new Date()).toLocaleDateString()}</div>
        </div>
        <div className="file-title">
            <h1>{title}</h1>
            <div className="subtitle">{subtitle}</div>
        </div>
    </>
}

export function Card ({ el }) {
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

export function HistoriesBien ({ el, elements, publishes, visites, prices }) {
    let historyElements  = getHistories('elements', elements, el);
    let historyPrices    = getHistories('prices', prices, el);
    let historyVisites   = getHistories('visites', visites, el);
    let historyPublishes = getHistories('publishes', publishes, el);

    return <>
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
        <div className="sub-content">
            <div className="title">Modifications</div>
            <div className="content">
                <div className="items">
                    {historyElements.length !== 0 ? historyElements : <Alert>Aucune modification enregistrée.</Alert>}
                </div>
            </div>
        </div>
    </>
}

function getHistories (type, data, el) {
    let histories = [];
    data.forEach(elem => {
        if(elem.bienId === el.id){
            let content = null;
            switch (type){
                case "elements":
                    content = <Modification elem={elem} key={elem.id} />
                    break;
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

export function Publication ({ elem }) {
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

export function Visite ({ elem }) {
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

export function Price ({ elem, el }) {
    return <div className="history">
        <div className="time">
            <span>{elem.createdAtString}</span>
        </div>
        <div className="infos">
            <span>{Sanitaze.toFormatCurrency(elem.price)} {el.codeTypeAd === 1 ? "cc/mois" : ""}</span>
        </div>
    </div>
}


export function Modification ({ elem }) {
    return <div className="history">
        <div className="time">
            <span>{elem.createdAtString}</span>
        </div>
        <div className="infos">
            <div>Modifié par : {elem.userFullname}</div>
            <div className="rapport-table">
                <div className="rapport-table-header">
                    <div className="rapport-table-item">
                        <div className="col-1">Type</div>
                        <div className="col-2">Ancienne valeur</div>
                        <div className="col-3">Nouvelle valeur</div>
                    </div>
                </div>
                <div className="rapport-table-body">
                    {elem.modifications.map((item, index) => {
                        return <div className="rapport-table-item" key={index}>
                            <div className="col-1">{item.type}</div>
                            <div className="col-2">{item.old}</div>
                            <div className="col-3">{item.new}</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div>
}
