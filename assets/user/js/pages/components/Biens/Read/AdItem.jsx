import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Diag }         from "./Data/Diag";
import { Infos }        from "./Data/Infos";
import { Rooms }        from "./Data/Rooms";
import { Photos }       from "./Data/Photos";
import { Contact }      from "./Data/Contact";
import { Features }     from "./Data/Features";
import { Localisation } from "./Data/Localisation";
import { Financial, FinancialVente } from "./Data/Financial";

import { Global }       from "@userPages/components/Biens/Suivi/Global";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import Sanitaze from "@commonComponents/functions/sanitaze";

export class AdItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elem: JSON.parse(props.elem),
            tenants: props.tenants ? JSON.parse(props.tenants) : [],
            rooms: props.rooms ? JSON.parse(props.rooms) : [],
            photos: props.photos ? JSON.parse(props.photos) : [],
            prospects: props.prospects ? JSON.parse(props.prospects) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            allVisits: props.visits ? JSON.parse(props.visits) : [],
            context: "infos",
            contextSuivi: "global"
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { elem, context, tenants, rooms, photos, prospects, allVisits } = this.state;

        let content;
        switch (context){
            case "address":
                content = <Localisation elem={elem} />
                break;
            case "photos":
                content = <Photos photos={photos} />
                break;
            case "rooms":
                content = <Rooms rooms={rooms} />
                break;
            case "contact":
                content = <Contact elem={elem} tenants={tenants} />
                break;
            case "financial":
                content = elem.codeTypeAd === 1 ? <Financial elem={elem} /> : <FinancialVente elem={elem} />
                break;
            case "diag":
                content = <Diag elem={elem} />
                break;
            case "features":
                content = <Features elem={elem} />
                break;
            default:
                content = <Infos elem={elem} />
                break;
        }

        return <div className="main-content">
            <div className="details-container">
                <div className="details-content-container">
                    <AdMainInfos elem={elem} />
                    <div className="details-general">
                        <AdBadges elem={elem} />
                        <div className="details-ad-actions">
                            <ButtonIcon element="a" target="_blank" icon="print">Imprimer</ButtonIcon>
                            <ButtonIcon element="a" icon="follow" onClick={Routing.generate('user_biens_suivi', {'slug': elem.slug})}>Suivi</ButtonIcon>
                        </div>
                    </div>
                    <Navigation context={context} onChangeContext={this.handleChangeContext} />
                    <div className="details-content">
                        {content}
                    </div>
                </div>
                <div className="details-suivi-container">
                    <div className="title">Suivi simplifié</div>
                    <div className="details-content">
                        <div className="toolbar">
                            <div className="item">
                                <Button element="a" onClick={Routing.generate('user_biens_suivi', {'slug': elem.slug})}>Voir le suivi détaillé</Button>
                            </div>
                        </div>
                        <Global elem={elem} prospects={prospects} visits={allVisits} />
                    </div>
                </div>
            </div>
        </div>
    }
}

export function AdBadges ({ elem }) {
    return <div className="badges">
        <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
        <div className="badge badge-default">{elem.typeAdString}</div>
        <div className="badge badge-default">{elem.typeBienString}</div>
        <div className="badge badge-default">Mandat {elem.mandat.typeMandatString.toLowerCase()}</div>
    </div>
}

export function AdMainInfos ({ elem }) {
    return <div className="details-main-infos">
        {elem.isDraft && <div className="isDraft"><div>Brouillon</div></div>}
        <div className="details-pretitle">{elem.agency.name}</div>
        <div className="details-title">
            <a href={Routing.generate('user_biens_read', {'slug': elem.slug})}>
                {elem.libelle}
            </a>
        </div>
        <div className="details-subtitle">
            <div>
                <div>{elem.localisation.address}</div>
                <div>{elem.localisation.zipcode}, {elem.localisation.city}</div>
            </div>
            <div className="details-subtitle-price">
                {Sanitaze.toFormatCurrency(elem.financial.price)} {elem.codeTypeAd === 1 ? "cc/mois" : ""}
            </div>
        </div>
        <div className="details-subtitle">{elem.area.total}m² - {elem.number.piece} pièce{elem.number.piece > 1 ? "s" : ""}</div>
    </div>
}

function Navigation({ onChangeContext, context }){

    let items = [
        {context: "infos",       label: "Infos"},
        {context: "features",    label: "Détails"},
        {context: "rooms",       label: "Pièces"},
        {context: "address",     label: "Adresse"},
        {context: "diag",        label: "Diagnostic"},
        {context: "financial",   label: "Financier"},
        {context: "contact",     label: "Contact"},
        {context: "photos",      label: "Photos"},
    ]

    return (
        <div className="details-nav">
            <div className="details-nav-items">
                {items.map(el => {
                    return <div className={context === el.context ? "active" : ""} onClick={() => onChangeContext(el.context)} key={el.context}>{el.label}</div>
                })}
            </div>
        </div>
    )
}