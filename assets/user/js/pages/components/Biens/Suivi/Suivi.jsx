import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Aside } from "@dashboardComponents/Tools/Aside";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";
import { Button, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

import Sanitaze   from "@commonComponents/functions/sanitaze";
import DataState  from "@userPages/components/Biens/Form/data";
import UpdateList from "@dashboardComponents/functions/updateList";
import AgendaData from "@userPages/components/Agenda/agendaData";

import { Financial, FinancialVente } from "@userPages/components/Biens/Read/Data/Financial";
import { Global }             from "@userPages/components/Biens/Suivi/Global/Global";
import { Visits }             from "@dashboardPages/components/Immo/Visits/Visits";
import { Contracts }          from "@userPages/components/Biens/Suivi/Contract/Contracts";
import { LastVisites }        from "@userPages/components/Biens/Suivi/Visite/LastVisites";
import { Rapprochements }     from "@userPages/components/Biens/Suivi/Rapprochement/Rapprochements";
import { ContractFormulaire } from "@userPages/components/Biens/Suivi/Contract/ContractForm";
import { Localisation }       from "@userPages/components/Biens/Read/Data/Localisation";
import { Photos }             from "@userPages/components/Biens/Read/Data/Photos";
import { Rooms }              from "@userPages/components/Biens/Read/Data/Rooms";
import { Contact }            from "@userPages/components/Biens/Read/Data/Contact";
import { Diag }               from "@userPages/components/Biens/Read/Data/Diag";
import { Features }           from "@userPages/components/Biens/Read/Data/Features";
import { Infos }              from "@userPages/components/Biens/Read/Data/Infos";

const URL_GET_DATA = 'api_agenda_data_persons';

export class Suivi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: "suivi",
            context: props.context ? props.context : "global",
            elem: JSON.parse(props.elem),
            rooms: props.rooms ? JSON.parse(props.rooms) : [],
            photos: props.photos ? JSON.parse(props.photos) : [],
            suivis: props.suivis ? JSON.parse(props.suivis) : [],
            offers: props.offers ? JSON.parse(props.offers) : [],
            contracts: props.contracts ? JSON.parse(props.contracts) : [],
            rapprochements: props.rapprochements ? JSON.parse(props.rapprochements) : [],
            allVisits: props.visits ? JSON.parse(props.visits) : [],
            historiesVisits: props.historiesVisits ? JSON.parse(props.historiesVisits) : [],
            allProspects: [],
            loadDataProspects: false,
        }

        this.rapprochement = React.createRef();
        this.aside = React.createRef();

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateProspects = this.handleUpdateProspects.bind(this);
        this.handleUpdateSuivis = this.handleUpdateSuivis.bind(this);
        this.handleUpdateVisits = this.handleUpdateVisits.bind(this);
        this.handleUpdateOffers = this.handleUpdateOffers.bind(this);
        this.handleUpdateContracts = this.handleUpdateContracts.bind(this);
        this.handleOpenAside = this.handleOpenAside.bind(this);
    }

    componentDidMount = () => {
        DataState.getProspects(this);
        AgendaData.getData(this, URL_GET_DATA);
    }

    handleChangePage = (page, context) => { this.setState({ page, context }) }
    handleChangeContext = (context) => { this.setState({ context }) }

    handleUpdateProspects = (allProspects) => { this.setState({ allProspects }); AgendaData.getData(this, URL_GET_DATA); }

    handleUpdateSuivis = (nSuivis) => { this.setState({ suivis: nSuivis }) }

    handleUpdateVisits = () => { DataState.getVisits(this, this.state.elem); }

    handleUpdateOffers = (offer, suivi, context) => {
        const { offers } = this.state;

        this.rapprochement.current.handleUpdateList(suivi, 'update');
        let nOffers = UpdateList.update(context, offers, offer);

        this.setState({ offers: nOffers })
    }

    handleUpdateContracts = (contract, context) => {
        let nContracts = UpdateList.update(context, this.state.contracts, contract);
        this.setState({ contracts: nContracts })
    }

    handleOpenAside = () => {
        this.aside.current.handleOpen("Bien vendu")
    }

    render () {
        const { contextRapprochement } = this.props;
        const { elem, page, context, suivis, contracts, allVisits, loadDataProspects, rooms, photos } = this.state;

        let content;
        switch (context){
            case "contracts":
                content = <Contracts donnees={JSON.stringify(contracts)} bien={elem} onUpdateContracts={this.handleUpdateContracts} classes={"bien-contracts"}/>
                break;
            case "rapprochements":
                content = <Rapprochements ref={this.rapprochement} {...this.state} data={suivis} context={contextRapprochement}
                                          societyId={elem.agency.society.id} agencyId={elem.agency.id}
                                          onUpdateProspects={this.handleUpdateProspects} onUpdateVisits={this.handleUpdateVisits}
                                          onUpdateOffers={this.handleUpdateOffers} onUpdateSuivis={this.handleUpdateSuivis}/>
                break;
            case "visites":
                content = <Visits {...this.state} bienId={elem.id} donnees={JSON.stringify(allVisits)} onUpdateVisits={this.handleUpdateVisits}
                                  isSuiviPage={true} loadDataAgenda={false} classes={""}/>
                break;
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
                content = <Contact elem={elem} />
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
            case "infos":
                content = <Infos elem={elem} />
                break;
            default:
                content = <>
                    <div className="suivi-section">
                        <Global elem={elem} suivis={suivis} visits={allVisits} />
                    </div>
                    {allVisits.length !== 0 && <div className="suivi-section">
                        <div className="title">Les 20 prochaines visites</div>
                        <LastVisites visits={allVisits} maxResults={20}/>
                    </div>}
                </>
                break;
        }

        let contentAside = <ContractFormulaire type="create" bien={elem} />;

        let actionsPrinter = [
            {data: <a target="_blank" href={Routing.generate("user_printer_bien_display", {'slug': elem.slug, "ori": "portrait"})}>Imprimer la fiche portrait</a>},
            {data: <a target="_blank" href={Routing.generate("user_printer_bien_display", {'slug': elem.slug, "ori": "landscape"})}>Imprimer la fiche paysage</a>},
        ]

        let menuSuivi = [
            {context: "global",            label: "Global"},
            {context: "visites",           label: "Visites"},
            {context: "rapprochements",    label: "Rapprochements"},
            {context: "contracts",         label: "Contrats"},
        ]

        let menuDetails = [
            {context: "infos",       label: "Infos"},
            {context: "features",    label: "Détails"},
            {context: "rooms",       label: "Pièces"},
            {context: "address",     label: "Adresse"},
            {context: "diag",        label: "Diagnostic"},
            {context: "financial",   label: "Financier"},
            {context: "contact",     label: "Contact"},
            {context: "photos",      label: "Photos"},
        ]

        return <div className="main-content">
            {!loadDataProspects ? <LoaderElement /> : <>
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
                                        <ButtonIconDropdown icon="print" items={actionsPrinter}>Imprimer</ButtonIconDropdown>
                                    </div>
                                </div>
                                {elem.status !== 0 && <div className="details-general">
                                    <div />
                                    <Button type="default" onClick={this.handleOpenAside}>Bien vendu</Button>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="item-nav-2">
                    <PageNavigation context={page} onChangeContext={this.handleChangePage} />
                    <Navigation context={context} onChangeContext={this.handleChangeContext} menu={page === "suivi" ? menuSuivi : menuDetails} />
                </div>
                <div className="item-content-2">
                    <div>
                        {content}
                    </div>
                </div>

                <Aside ref={this.aside} content={contentAside}/>
            </>}
        </div>
    }
}

function Navigation({ onChangeContext, context, menu = null }){

    let items = menu ? menu : []

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

function PageNavigation({ onChangeContext, context, menu = null }){

    let items = menu ? menu : [
        {page: "suivi",    context: "global", label: "Suivi"},
        {page: "details",  context: "infos", label: "Détails"},
    ]

    return (
        <div className="details-nav">
            <div className="details-nav-items">
                {items.map(el => {
                    return <div className={context === el.page ? "active" : ""} onClick={() => onChangeContext(el.page, el.context)} key={el.context}>{el.label}</div>
                })}
            </div>
        </div>
    )
}

export function AdBadges ({ elem }) {
    return <div className="badges">
        <div className={"badge-bien badge badge-" + elem.status}>{elem.statusString}</div>
        <div className="badge-bien badge">{elem.typeAdString}</div>
        <div className="badge-bien badge">{elem.typeBienString}</div>
        <div className="badge-bien badge">Mandat {elem.mandat.typeMandatString.toLowerCase()}</div>
    </div>
}

export function AdMainInfos ({ elem }) {
    return <div className="details-main-infos">
        {elem.isDraft && <div className="isDraft"><div>Brouillon</div></div>}
        <div className="details-pretitle">{elem.agency.name}</div>
        <div className="details-title">
            <a href={Routing.generate('user_biens_suivi', {'slug': elem.slug})}>
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
