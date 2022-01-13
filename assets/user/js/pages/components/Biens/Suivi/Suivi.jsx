import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Prospects }    from "@userPages/components/Biens/Suivi/Prospects";
import { Global }       from "@userPages/components/Biens/Suivi/Global";
import { Visits }       from "@dashboardPages/components/Immo/Visits/Visits";
import { AdBadges, AdMainInfos } from "@userPages/components/Biens/Read/AdItem";

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

import DataState from "@userPages/components/Biens/Form/data";


export class Suivi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elem: JSON.parse(props.elem),
            prospects: props.prospects ? JSON.parse(props.prospects) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            allVisits: props.visits ? JSON.parse(props.visits) : [],
            context: props.context ? props.context : "global",
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateVisits = this.handleUpdateVisits.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    handleUpdateVisits = () => {
        DataState.getVisits(this, this.state.elem);
    }

    render () {
        const { elem, context, prospects, negotiators, allVisits } = this.state;

        let content;
        switch (context){
            case "offres":
                content = <div>Offres</div>
                break;
            case "prospects":
                content = <Prospects elem={elem} data={prospects} societyId={elem.agency.society.id} agencyId={elem.agency.id} negotiators={negotiators} />
                break;
            case "visites":
                content = <Visits bienId={elem.id} donnees={JSON.stringify(allVisits)} onUpdateVisits={this.handleUpdateVisits} classes={""}/>
                break;
            default:
                content = <Global elem={elem} prospects={prospects} visits={allVisits} />
                break;
        }

        return <div className="main-content">
            <div className="details-container">
                <div className="details-content-container suivi-container">
                    <AdMainInfos elem={elem} />
                    <div className="details-general">
                        <AdBadges elem={elem} />
                        <div className="details-ad-actions">
                            <ButtonIcon element="a" icon="vision" onClick={Routing.generate('user_biens_read', {'slug': elem.slug})}>Détails</ButtonIcon>
                        </div>
                    </div>
                    <Navigation context={context} onChangeContext={this.handleChangeContext} />
                    <div className="details-content">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    }
}

function Navigation({ onChangeContext, context }){

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