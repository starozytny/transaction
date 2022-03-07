import React, { Component } from "react";

import axios        from "axios";
import toastr       from "toastr";
import Swal         from "sweetalert2";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { PageInfos2 }    from "@userComponents/Layout/Page";
import { Aside }         from "@dashboardComponents/Tools/Aside";
import { Alert }         from "@dashboardComponents/Tools/Alert";
import { Button }        from "@dashboardComponents/Tools/Button";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

import Sort          from "@commonComponents/functions/sort";
import DataState     from "@userPages/components/Biens/Form/data";
import Formulaire    from "@dashboardComponents/functions/Formulaire";

import { ProspectFormulaire }       from "@dashboardPages/components/Immo/Prospects/ProspectForm";
import { Prospects }                from "@dashboardPages/components/Immo/Prospects/Prospects";
import { OfferFormulaire }          from "@userPages/components/Biens/Suivi/Offer/OfferForm";
import { OfferFinalFormulaire }     from "@userPages/components/Biens/Suivi/Offer/OfferFinalForm";
import { RapprochementsItem }       from "@userPages/components/Biens/Suivi/Rapprochement/RapprochementsItem";
import { ContractFormulaire }       from "@userPages/components/Biens/Suivi/Contract/ContractForm";
import { AgendaFormulaire }         from "@userPages/components/Agenda/AgendaForm";

const URL_DELETE_OFFER = "api_offers_delete";
const URL_SWITCH_STATUS_OFFER = "api_offers_switch_status";

const STATUS_SUIVI_TO_PROCESS = 0;
const STATUS_SUIVI_PROCESSING = 1;
const STATUS_SUIVI_ENDING = 2;

const STATUS_PROPAL = 0;
const STATUS_ACCEPT = 1;
const STATUS_REFUSE = 2;

const SORTER = Sort.compareProspectLastname;
let i = 0;

export class Rapprochements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            subContext: props.context ? props.context : "tous",
            sorter: SORTER,
            loadDataProspects: props.loadDataProspects ? props.loadDataProspects : false,
            allProspects: props.allProspects ? props.allProspects : [],
            data: props.data,
            rapprochements: props.rapprochements,
            element: null,
            offer: null,
            persons: {}
        }

        this.aside = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleSelectProspect = this.handleSelectProspect.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDeleteOffer = this.handleDeleteOffer.bind(this);
        this.handleSwitchStatusOffer = this.handleSwitchStatusOffer.bind(this);
    }

    handleChangeSubContext = (subContext) => { this.setState({ subContext })}

    handleChangeContext = (context, element, offer = null) => {
        let nElement = element ? element : this.state.element;
        let nPersons = {};

        switch (context){
            case "create-visit":
                nPersons = {users: [], managers: [], negotiators: [], owners: [], tenants: [], buyers: [],
                    prospects: [{ value: element.id, label: element.fullname, email: element.email }]}
                this.aside.current.handleOpen("Programmer une visite pour " + element.fullname);
                break;
            case "final-offer":
                this.aside.current.handleOpen("Finaliser l'offre de " + element.fullname);
                break;
            case "accept-offer":
                this.aside.current.handleOpen("Accepter l'offre de " + element.fullname);
                break;
            case "update-offer":
                this.aside.current.handleOpen("Modifier l'offre de " + element.fullname);
                break;
            case "create-offer":
                this.aside.current.handleOpen("Faire une offre de la part de " + element.fullname);
                break;
            case "update":
                this.aside.current.handleOpen("Modifier " + element.fullname);
                break;
            case "create":
                this.aside.current.handleOpen("Ajouter un prospect");
                break;
            case "select":
                this.aside.current.handleOpen("Sélectionner un existant");
                break;
            default:
                if(this.aside.current){
                    this.aside.current.handleClose()
                }
                break;
        }

        this.setState({ context: context, element: nElement, offer: offer, persons: nPersons })
    }

    handleUpdateData = (allProspects) => { this.setState({ allProspects }) }

    handleUpdateListProspects = (element, newContext = null) => {
        const { data, context, sorter } = this.state;

        Formulaire.updateData(this, sorter, newContext, context, data, element);
        DataState.getProspects(this, this.props.onUpdateProspects);
    }

    handleUpdateList = (element, newContext=null) => {
        const { data, context, sorter} = this.state;

        Formulaire.updateData(this, sorter, newContext, context, data, element);
        this.props.onUpdateSuivis(this.state.data)
    }

    handleSelectProspect = (prospect) => {
        const { elem } = this.props; //bien

        Formulaire.loader(true)
        const self = this;
        axios.post(Routing.generate('api_suivis_link_bien_prospect', {'bien': elem.id, 'prospect': prospect.id}), {})
            .then(function (response) {
                toastr.info(response.data.context === "create" ? "Prospect ajouté !" : "Prospect enlevé !");
                self.handleUpdateList(JSON.parse(response.data.obj), response.data.context)
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
            })
            .then(function (){
                Formulaire.loader(false)
            })
        ;
    }

    handleDeleteOffer = (offer) => {
        swalOfferAction(this, "DELETE", Routing.generate(URL_DELETE_OFFER, {'id': offer.id}),
            offer, "delete", "Supprimer cette offre", "Action irréversible.")
    }

    handleSwitchStatusOffer = (offer, status) => {
        let title = offer.status === STATUS_PROPAL ? "Refuser cette offre" : "Rétablir l'offre";
        swalOfferAction(this, "PUT", Routing.generate(URL_SWITCH_STATUS_OFFER, {'id': offer.id, 'status': status}),
            offer, "update", title)
    }

    render () {
        const { elem, societyId, agencyId, offers, onUpdateOffers,
            users, managers, negotiators, owners, tenants, buyers, historiesVisits } = this.props;
        const { loadDataProspects, context, subContext, data, allProspects, element, offer, rapprochements, persons } = this.state;

        let nData = [];
        let nbPossibilities = 0, nbProcessing = 0, nbEnding = 0;

        let items = [];
        let prospects = [], prospectsUsed = [];
        data.forEach(el => {

            let noDuplicateHistories = [];
            el.prospect.nbVisits = 0;

            historiesVisits.forEach(hi => {
                if(!noDuplicateHistories.includes(hi.visiteId)){
                    noDuplicateHistories.push(hi.visiteId)

                    if(hi.status !== 4){
                        hi.prospects.forEach(pr => {
                            if(pr.value === el.prospect.id){
                                el.prospect.nbVisits = el.prospect.nbVisits + 1;
                            }
                        })
                    }
                }
            })

            nData.push({ lastname: el.prospect.lastname, suivi: el, rapprochement: null })
            prospects.push(el.prospect);
            prospectsUsed.push(el.prospect.id);
        })

        if(allProspects.length !== 0){
            rapprochements.forEach(el => {
                if(!prospectsUsed.includes(el.prospect)){
                    let prospect = getProspect(allProspects, el.prospect);
                    if(prospect){
                        nbPossibilities++;
                        nData.push({ lastname: prospect.lastname, suivi: null, rapprochement: prospect })
                    }
                }
            })
        }

        nData.sort(Sort.compareLastname);
        nData.forEach((item, index) => {
            let canAdd = false;

            switch (subContext) {
                case "ending":
                    if(item.suivi && item.rapprochement === null && item.suivi.status === STATUS_SUIVI_ENDING){
                        canAdd = true;
                    }
                    break;
                case "processing":
                case "to_process":
                    if(item.suivi && item.rapprochement === null && (item.suivi.status === STATUS_SUIVI_TO_PROCESS || item.suivi.status === STATUS_SUIVI_PROCESSING)){
                        canAdd = true;
                    }
                    break;
                case "possibilities":
                    if(item.suivi === null && item.rapprochement){
                        canAdd = true;
                    }
                    break;
                default:
                    canAdd = true;
                    break;
            }

            if(canAdd){
                if(item.suivi){
                    let el = item.suivi;
                    items.push(<RapprochementsItem elem={el} prospect={el.prospect} bien={elem} offer={getOffer(offers, el.prospect)} key={index}
                                                   onSelectProspect={this.handleSelectProspect} onChangeContext={this.handleChangeContext}
                                                   onDeleteOffer={this.handleDeleteOffer} onSwitchStatusOffer={this.handleSwitchStatusOffer} />)
                }else{
                    let el = item.rapprochement;
                    items.push(<RapprochementsItem elem={null} prospect={el} bien={elem} key={index}
                                                   onSelectProspect={this.handleSelectProspect}/>)
                }
            }
        })

        let nNegotiators = [];
        if(negotiators){
            negotiators.map(ne => {
                ne.agency = { id: agencyId }
                nNegotiators.push(ne)
            })
        }

        let contentAside;
        switch (context) {
            case "create-visit":
                contentAside = <AgendaFormulaire type="create" useAside={true} refAside={this.aside}
                                                 users={users} managers={managers} negotiators={negotiators} owners={owners} tenants={tenants}
                                                 buyers={buyers} prospects={allProspects} bienId={elem.id} persons={persons}
                                                 onUpdateList={this.props.onUpdateVisits}
                                                 url_create={'api_visits_create'} key={i++}
                />
                break;
            case "final-offer":
                contentAside = <ContractFormulaire type="create" bien={elem} prospect={element}/>;
                break;
            case "accept-offer":
                contentAside = <OfferFinalFormulaire type="update" element={offer}
                                                    onUpdateList={onUpdateOffers} onChangeContext={this.handleChangeContext}/>;
                break;
            case "update-offer":
                contentAside = <OfferFormulaire type="update" bien={elem} prospect={element} element={offer}
                                                onUpdateList={onUpdateOffers} onChangeContext={this.handleChangeContext}/>;
                break;
            case "create-offer":
                contentAside = <OfferFormulaire type="create" bien={elem} prospect={element}
                                                onUpdateList={onUpdateOffers} onChangeContext={this.handleChangeContext}/>;
                break;
            case "update":
                contentAside = <ProspectFormulaire type="update" isFromRead={true} isClient={true} element={element} bienId={elem.id} negotiators={nNegotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateListProspects}/>;
                break;
            case "create":
                contentAside = <ProspectFormulaire type="create" isFromRead={true} isClient={true} bienId={elem.id} negotiators={nNegotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateListProspects}/>;
                break;
            case "select":
                contentAside = <Prospects isSelect={true} isClient={true}
                                          donnees={JSON.stringify(allProspects)} prospects={prospects} classes={" "}
                                          onSelectProspect={this.handleSelectProspect} key={i++} />
                break;
            default:
                break;
        }

        let subMenu = [
            { value: 'tous',            label: 'Tous'               , total: nbPossibilities + nbProcessing + nbEnding},
            { value: 'possibilities',   label: 'Possibilités'       , total: nbPossibilities},
            { value: 'processing',      label: 'A traiter/En cours' , total: nbProcessing},
            { value: 'ending',          label: 'Traités'            , total: nbEnding},
        ]

        let pageInfosActions = <>
            <Button onClick={() => this.handleChangeContext('select')}>Sélectionner</Button>
            <Button outline={true} onClick={() => this.handleChangeContext('create')}>Ajouter</Button>
        </>

        return (<div className="details-tab-infos">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <PageInfos2 image="/build/user/images/add-prospect.png" actions={pageInfosActions}>
                            <p>
                                Vous pouvez sélectionner ou ajouter un prospect à la liste des
                                rapprochements manuellement en cliquant sur le bouton correspondant.
                            </p>
                        </PageInfos2>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2 rapprochement-submenu">
                            {subMenu.map((sub, index) => {
                                return <div className={"item" + (sub.value === subContext ? " active" : "")}
                                            onClick={() => this.handleChangeSubContext(sub.value)}
                                            key={index}>
                                    <span>{sub.label}</span>
                                    <span className="total">
                                        <span>{sub.total}</span>
                                    </span>
                                </div>
                            })}
                        </div>
                    </div>
                    <div>
                        {!loadDataProspects ? <LoaderElement /> : (items && items.length !== 0 ? items : <Alert>Aucun résultat</Alert>)}
                    </div>
                </div>
            </div>

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }
}

function getProspect(prospects, id){
    let prospect = null;
    prospects.forEach(el => {
        if(el.id === id){
            prospect = el;
        }
    })

    return prospect;
}

function getOffer(offers, prospect) {
    let offer = null
    offers.forEach(of => {
        if(of.prospect.id === prospect.id){
            offer = of;
        }
    })

    return offer;
}

function swalOfferAction(self, method, url, offer, context, title, text="") {
    Swal.fire(SwalOptions.options(title, text))
        .then((result) => {
            if (result.isConfirmed) {
                Formulaire.loader(true)
                axios({ method: method, url: url, data: {} })
                    .then(function (response) {
                        let offer = JSON.parse(response.data.offer);
                        let suivi = JSON.parse(response.data.suivi);

                        self.props.onUpdateOffers(offer, suivi, context);
                    })
                    .catch(function (error) {
                        Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                    })
                    .then(() => {
                        Formulaire.loader(false);
                    })
                ;
            }
        })
    ;
}
