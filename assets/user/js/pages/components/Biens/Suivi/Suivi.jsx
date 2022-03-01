import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Rapprochements } from "@userPages/components/Biens/Suivi/Rapprochement/Rapprochements";
import { Global }         from "@userPages/components/Biens/Suivi/Global/Global";
import { LastVisites }    from "@userPages/components/Biens/Suivi/Visite/LastVisites";
import { Visits }         from "@dashboardPages/components/Immo/Visits/Visits";
import { AdBadges, AdMainInfos } from "@userPages/components/Biens/Read/AdItem";

import { ButtonIcon }    from "@dashboardComponents/Tools/Button";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

import DataState  from "@userPages/components/Biens/Form/data";
import UpdateList from "@dashboardComponents/functions/updateList";
import AgendaData from "@userPages/components/Agenda/agendaData";

const URL_GET_DATA = 'api_agenda_data_persons';

export class Suivi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: props.context ? props.context : "global",
            elem: JSON.parse(props.elem),
            suivis: props.suivis ? JSON.parse(props.suivis) : [],
            offers: props.offers ? JSON.parse(props.offers) : [],
            rapprochements: props.rapprochements ? JSON.parse(props.rapprochements) : [],
            allVisits: props.visits ? JSON.parse(props.visits) : [],
            allProspects: [],
            loadDataProspects: false
        }

        this.rapprochement = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateProspects = this.handleUpdateProspects.bind(this);
        this.handleUpdateSuivis = this.handleUpdateSuivis.bind(this);
        this.handleUpdateVisits = this.handleUpdateVisits.bind(this);
        this.handleUpdateOffers = this.handleUpdateOffers.bind(this);
    }

    componentDidMount = () => {
        DataState.getProspects(this);
        AgendaData.getData(this, URL_GET_DATA);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    handleUpdateProspects = () => { DataState.getProspects(this); }

    handleUpdateSuivis = (nSuivis) => { this.setState({ suivis: nSuivis }) }

    handleUpdateVisits = () => { DataState.getVisits(this, this.state.elem); }

    handleUpdateOffers = (offer, suivi, context) => {
        const { offers } = this.state;

        this.rapprochement.current.handleUpdateList(suivi, 'update');
        let nOffers = UpdateList.update(context, offers, offer);

        this.setState({ offers: nOffers })
    }

    render () {
        const { contextRapprochement } = this.props;
        const { elem, context, suivis, allVisits, loadDataProspects} = this.state;

        let content;
        switch (context){
            case "offres":
                content = <div>Offres</div>
                break;
            case "rapprochements":
                content = <Rapprochements ref={this.rapprochement} {...this.state} data={suivis} context={contextRapprochement}
                                          societyId={elem.agency.society.id} agencyId={elem.agency.id}
                                          onUpdateProspects={this.handleUpdateProspects}
                                          onUpdateOffers={this.handleUpdateOffers} onUpdateSuivis={this.handleUpdateSuivis}/>
                break;
            case "visites":
                content = <Visits {...this.state} bienId={elem.id} donnees={JSON.stringify(allVisits)} onUpdateVisits={this.handleUpdateVisits}
                                  isSuiviPage={true} loadDataAgenda={false} classes={""}/>
                break;
            default:
                content = <>
                    <div className="suivi-section">
                        <Global elem={elem} suivis={suivis} visits={allVisits} />
                    </div>
                    <div className="suivi-section">
                        <div className="title">Les 20 prochaines visites</div>
                        <LastVisites visits={allVisits} maxResults={20}/>
                    </div>
                </>
                break;
        }

        return <div className="main-content">
            <div className="details-container">
                <div className="details-content-container suivi-container">
                    <div className="details-card">
                        <div className="details-image">
                            <img src={elem.mainPhotoFile} alt="Illustration bien"/>
                        </div>
                        <div>
                            <AdMainInfos elem={elem} />
                            <div className="details-general">
                                <AdBadges elem={elem} />
                                <div className="details-ad-actions">
                                    <ButtonIcon element="a" icon="vision" onClick={Routing.generate('user_biens_read', {'slug': elem.slug})}>Détails</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="item-nav-2">
                <Navigation context={context} onChangeContext={this.handleChangeContext} />
            </div>
            <div className="item-content-2">
                <div>
                    {!loadDataProspects ? <LoaderElement /> : content}
                </div>
            </div>
        </div>
    }
}

function Navigation({ onChangeContext, context, menu = null }){

    let items = menu ? menu : [
        {context: "global",            label: "Global"},
        {context: "visites",           label: "Visites"},
        {context: "rapprochements",    label: "Rapprochements"},
        // {context: "offres",            label: "Offres"},
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
