import React, { Component } from "react";

import axios        from "axios";
import toastr       from "toastr";
import Swal         from "sweetalert2";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Aside }      from "@dashboardComponents/Tools/Aside";
import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Button }     from "@dashboardComponents/Tools/Button";

import DataState     from "@userPages/components/Biens/Form/data";
import Sort          from "@commonComponents/functions/sort";
import Formulaire    from "@dashboardComponents/functions/Formulaire";

import { ProspectFormulaire }       from "@dashboardPages/components/Immo/Prospects/ProspectForm";
import { Prospects }                from "@dashboardPages/components/Immo/Prospects/Prospects";
import { OfferFormulaire }          from "@userPages/components/Biens/Suivi/Offer/OfferForm";
import { OfferFinalFormulaire }     from "@userPages/components/Biens/Suivi/Offer/OfferFinalForm";
import { RapprochementsItem }       from "@userPages/components/Biens/Suivi/Rapprochement/RapprochementsItem";

const URL_DELETE_OFFER = "api_offers_delete";
const URL_SWITCH_STATUS_OFFER = "api_offers_switch_status";

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
            subContext: "tous",
            sorter: SORTER,
            data: props.data,
            element: null,
            offer: null,
            allProspects: [],
        }

        this.aside = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleSelectProspect = this.handleSelectProspect.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDeleteOffer = this.handleDeleteOffer.bind(this);
        this.handleSwitchStatusOffer = this.handleSwitchStatusOffer.bind(this);
    }

    componentDidMount() {
        DataState.getProspects(this);
    }

    handleChangeContext = (context, element, offer = null) => {
        let nElement = element ? element : this.state.element;

        switch (context){
            case "final-offer":
                this.aside.current.handleOpen("Finaliser l'offre de " + element.fullname);
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

        this.setState({ context: context, element: nElement, offer: offer })
    }

    handleUpdateListProspects = (element, newContext = null) => {
        const { data, context, sorter } = this.state;

        Formulaire.updateData(this, sorter, newContext, context, data, element);
        DataState.getProspects(this);
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
        const { elem, societyId, agencyId, negotiators, offers, onUpdateOffers } = this.props;
        const { context, subContext, data, allProspects, sorter, element, offer } = this.state;

        data.sort(sorter)

        let items = [];
        let prospects = [];
        data.forEach(elem => {
            items.push(<RapprochementsItem elem={elem} offer={getOffer(offers, elem.prospect)} key={elem.id}
                                           onSelectProspect={this.handleSelectProspect} onChangeContext={this.handleChangeContext}
                                           onDeleteOffer={this.handleDeleteOffer} onSwitchStatusOffer={this.handleSwitchStatusOffer} />)
            prospects.push(elem.prospect)
        })

        let contentAside;
        switch (context) {
            case "final-offer":
                contentAside = <OfferFinalFormulaire type="update" element={offer}
                                                    onUpdateList={onUpdateOffers} onChangeContext={this.handleChangeContext}/>;
                break
            case "update-offer":
                contentAside = <OfferFormulaire type="update" bien={elem} prospect={element} element={offer}
                                                onUpdateList={onUpdateOffers} onChangeContext={this.handleChangeContext}/>;
                break
            case "create-offer":
                contentAside = <OfferFormulaire type="create" bien={elem} prospect={element}
                                                onUpdateList={onUpdateOffers} onChangeContext={this.handleChangeContext}/>;
                break
            case "update":
                contentAside = <ProspectFormulaire type="update" isFromRead={true} isClient={true} element={element} bienId={elem.id} negotiators={negotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateListProspects}/>;
                break
            case "create":
                contentAside = <ProspectFormulaire type="create" isFromRead={true} isClient={true} bienId={elem.id} negotiators={negotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateListProspects}/>;
                break
            case "select":
                contentAside = <Prospects isSelect={true} isClient={true}
                                          donnees={JSON.stringify(allProspects)} prospects={prospects} classes={" "}
                                          onSelectProspect={this.handleSelectProspect} key={i++} />
                break;
            default:
                break;
        }

        let subMenu = [
            { value: 'tous',            label: 'Tous' },
            { value: 'possibilities',   label: 'Possibilités' },
            { value: 'to_process',      label: 'A traiter' },
            { value: 'processing',      label: 'En cours' },
            { value: 'ending',          label: 'Finalisés' },
        ]

        return (<div className="details-tab-infos">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="content-col-1 ra-pr-content">
                            <div className="ra-pr-image">
                                <img src="/build/user/images/add-prospect.png" alt="illustration add prospect"/>
                            </div>
                            <div className="ra-pr-text">
                                <p>
                                    Vous pouvez sélectionner ou ajouter un prospect à la liste des
                                    rapprochements manuellement en cliquant sur le bouton correspondant.
                                </p>
                            </div>
                            <div className="ra-pr-actions">
                                <Button onClick={() => this.handleChangeContext('select')}>Sélectionner</Button>
                                <Button outline={true} onClick={() => this.handleChangeContext('create')}>Ajouter</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="title-col-2">
                        <div className="tab-col-2">
                            {subMenu.map((sub, index) => {
                                return <div className={"item" + (sub.value === subContext ? " active" : "")} key={index}>{sub.label}</div>
                            })}
                        </div>
                    </div>
                    <div>
                        {items && items.length !== 0 ? items : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }
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