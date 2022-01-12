import React, { Component } from 'react';

import Routing       from '@publicFolder/bundles/fosjsrouting/js/router.min.js';
import Sanitize      from "@commonComponents/functions/sanitaze";

import { Infos }     from "./split/Infos";
import { Features }  from "./split/Features";
import { Diag }      from "./split/Diag";
import { Financial } from "./split/Financial";
import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import Sanitaze from "@commonComponents/functions/sanitaze";

export class AdItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elem: JSON.parse(props.elem),
            subContext: "infos",
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (subContext) => { this.setState({ subContext }) }

    render () {
        const { elem, subContext } = this.state;

        let content;
        switch (subContext){
            case "financial":
                content = <Financial elem={elem} />
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

        console.log(elem)

        return <div className="main-content">
            <div className="details-container">
                <div className="details-content-container">
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
                    <div className="details-general">
                        <div className="badges">
                            <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                            <div className="badge badge-default">{elem.typeAdString}</div>
                            <div className="badge badge-default">{elem.typeBienString}</div>
                            <div className="badge badge-default">Mandat {elem.typeMandatString}</div>
                        </div>
                        <div className="details-ad-actions">
                            <ButtonIcon element="a" target="_blank" icon="print">Imprimer</ButtonIcon>
                        </div>
                    </div>
                    <Navigation subContext={subContext} onChangeContext={this.handleChangeContext} />
                    <div className="details-content">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    }
}

function Navigation({ onChangeContext, subContext }){

    let items = [
        {context: "infos",       label: "Infos"},
        {context: "features",    label: "Caractéristiques"},
        {context: "diag",        label: "Diagnostic"},
        {context: "financial",   label: "Financier"},
    ]

    return (
        <div className="details-nav">
            <div className="details-nav-items">
                {items.map(el => {
                    return <div className={subContext === el.context ? "active" : ""} onClick={() => onChangeContext(el.context)} key={el.context}>{el.label}</div>
                })}
            </div>
        </div>
    )
}