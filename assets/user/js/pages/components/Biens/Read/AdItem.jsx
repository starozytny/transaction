import React, { Component } from 'react';

import { Diag }         from "./Data/Diag";
import { Infos }        from "./Data/Infos";
import { Rooms }        from "./Data/Rooms";
import { Photos }       from "./Data/Photos";
import { Contact }      from "./Data/Contact";
import { Features }     from "./Data/Features";
import { Localisation } from "./Data/Localisation";
import { Financial, FinancialVente } from "./Data/Financial";

import { Prospects }    from "@userPages/components/Biens/Read/Suivi/Prospects";

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

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
            context: "infos",
            contextSuivi: "prospects"
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleChangeContextSuivi = this.handleChangeContextSuivi.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }
    handleChangeContextSuivi = (contextSuivi) => { this.setState({ contextSuivi }) }

    render () {
        const { elem, context, contextSuivi, tenants, rooms, photos, prospects, negotiators } = this.state;

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

        let contentSuivi;
        switch (contextSuivi){
            case "offres":
                contentSuivi = <div>Offres</div>
                break;
            case "prospects":
                contentSuivi = <Prospects elem={elem} data={prospects}
                                          societyId={elem.agency.society.id} agencyId={elem.agency.id} negotiators={negotiators} />
                break;
            case "visites":
                contentSuivi = <div>Visites</div>
                break;
            default:
                contentSuivi = <div>Global</div>
                break;
        }

        return <div className="main-content">
            <div className="details-container">
                <div className="details-content-container">
                    <div className="details-main-infos">
                        {elem.isDraft && <div className="isDraft"><div>Brouillon</div></div>}
                        <div className="details-pretitle">{elem.agency.name}</div>
                        <div className="details-title">{elem.libelle}</div>
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
                    <div className="details-general">
                        <div className="badges">
                            <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                            <div className="badge badge-default">{elem.typeAdString}</div>
                            <div className="badge badge-default">{elem.typeBienString}</div>
                            <div className="badge badge-default">Mandat {elem.typeMandatString.toLowerCase()}</div>
                        </div>
                        <div className="details-ad-actions">
                            <ButtonIcon element="a" target="_blank" icon="print">Imprimer</ButtonIcon>
                        </div>
                    </div>
                    <Navigation context={context} onChangeContext={this.handleChangeContext} />
                    <div className="details-content">
                        {content}
                    </div>
                </div>
                <div className="details-suivi-container">
                    <div className="title">Suivi</div>
                    <NavigationSuivi context={contextSuivi} onChangeContext={this.handleChangeContextSuivi} />
                    <div className="details-content">
                        {contentSuivi}
                    </div>
                </div>
            </div>
        </div>
    }
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

function NavigationSuivi({ onChangeContext, context }){

    let items = [
        {context: "global",    label: "Global"},
        {context: "visites",   label: "Visites"},
        {context: "prospects", label: "Prospects"},
        {context: "offres",    label: "Offres"},
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