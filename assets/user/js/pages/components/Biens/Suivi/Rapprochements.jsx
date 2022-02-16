import React, { Component } from "react";

import axios    from "axios";
import toastr   from "toastr";
import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Aside }      from "@dashboardComponents/Tools/Aside";
import { Alert }      from "@dashboardComponents/Tools/Alert";
import { HelpBubble } from "@dashboardComponents/Tools/HelpBubble";
import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import DataState     from "@userPages/components/Biens/Form/data";
import Sort          from "@commonComponents/functions/sort";
import Helper        from "@commonComponents/functions/helper";
import Formulaire    from "@dashboardComponents/functions/Formulaire";
import Rapprochement from "@userComponents/functions/rapprochement";

import { ProspectFormulaire }   from "@dashboardPages/components/Immo/Prospects/ProspectForm";
import { SearchInfos }          from "@dashboardPages/components/Immo/Prospects/ProspectsItem";
import { Prospects }            from "@dashboardPages/components/Immo/Prospects/Prospects";
import { NegotiatorBubble }     from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import { ContentNegotiatorBubble } from "@userPages/components/Biens/AdCard";

const SORTER = Sort.compareProspectLastname;
let i = 0;

export class Rapprochements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            sorter: SORTER,
            data: props.data,
            element: null,
            allProspects: [],
        }

        this.aside = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleSelectProspect = this.handleSelectProspect.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
    }

    componentDidMount() {
        DataState.getProspects(this);
    }

    handleChangeContext = (context, element) => {
        switch (context){
            case "update":
                this.aside.current.handleOpen("Modifier " + element.fullname);
                break;
            case "create":
                this.aside.current.handleOpen("Ajouter un prospect");
                break;
            default:
                this.aside.current.handleOpen("Sélectionner un existant");
                break;
        }

        this.setState({ context, element })
    }

    handleUpdateListProspects = (element, newContext = null) => {
        const { data, context, sorter } = this.state;

        Formulaire.updateData(this, sorter, newContext, context, data, element);
        DataState.getProspects(this);
    }

    handleUpdateList = (element, newContext=null) => {
        const { data, context, sorter} = this.state;

        Formulaire.updateData(this, sorter, newContext, context, data, element);
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

    render () {
        const { elem, societyId, agencyId, negotiators } = this.props;
        const { context, data, allProspects, sorter, element } = this.state;

        data.sort(sorter)

        let items = [];
        let prospects = [];
        data.forEach(elem => {
            items.push(<RapprochementsItem elem={elem} onSelectProspect={this.handleSelectProspect} key={elem.id} />)
            prospects.push(elem.prospect)
        })

        let contentAside;
        switch (context) {
            case "update":
                contentAside = <ProspectFormulaire type="update" isFromRead={true} isClient={true} element={element} bienId={elem.id} negotiators={negotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateListProspects}/>;
                break
            case "create":
                contentAside = <ProspectFormulaire type="create" isFromRead={true} isClient={true} bienId={elem.id} negotiators={negotiators}
                                                   societyId={societyId} agencyId={agencyId} onUpdateList={this.handleUpdateListProspects}/>;
                break
            default:
                contentAside = <Prospects isSelect={true} isClient={true}
                                          donnees={JSON.stringify(allProspects)} prospects={prospects} classes={" "}
                                          onSelectProspect={this.handleSelectProspect} key={i++} />
                break;
        }

        return (<div className="details-tab-infos">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="content-col-1 ra-pr-content">
                            <div>
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
                    <div>
                        {items && items.length !== 0 ? items : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>

            <Aside ref={this.aside} content={contentAside}/>
        </div>)
    }
}

export class RapprochementsItem extends Component {
    constructor(props) {
        super();

        this.helpBubble = React.createRef();

        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    handleOpenHelp = () => {
        this.helpBubble.current.handleOpen();
    }

    render () {
        const { elem, onSelectProspect } = this.props;

        let prospect = elem.prospect;
        let bien     = elem.bien;

        let percentage = 0;
        if(prospect.search){
            let biens, compteur;
            [biens, compteur] = Rapprochement.rapprochement(prospect.search, [bien]);

            percentage = Helper.countProgress(compteur, 14)
        }


        return <div className="card-ra">
            <div className="selector">
                <ButtonIcon icon="cancel" onClick={() => onSelectProspect(prospect)}>Enlever</ButtonIcon>
            </div>
            <div className="card-main">
                <div className="card-body">
                    <div className="infos">
                        <div className="col-1">
                            <div className="badges">
                                <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                            </div>
                            <div className="identifier">
                                <div className="title">
                                    <span>{prospect.fullname}</span>
                                </div>
                                <div className="address">
                                    <div>{prospect.email}</div>
                                    <div>{prospect.phone1}</div>
                                </div>
                                {prospect.negotiator && <NegotiatorBubble elem={prospect.negotiator} txt={null} />}
                            </div>
                        </div>
                        <div className="col-2">
                            {prospect.search && <SearchInfos elem={prospect.search} isRa={true} />}
                        </div>
                        <div className="col-3">
                            <div className="ra-percentage">
                                <figure className={"chart-two chart-two-"+ percentage +" animate"}>
                                    <svg role="img" xmlns="http://www.w3.org/2000/svg">
                                        <title>Pourcentage rapprochement</title>
                                        <circle className="circle-background"/>
                                        <circle className="circle-foreground"/>
                                    </svg>
                                    <figcaption>{prospect.search ? percentage : "0%"}</figcaption>
                                </figure>
                                <div className="tooltip">Rapprochement</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="commentary">Commentaire : </div>

                    <div className="footer-actions">
                        <div className="actions">
                            <ButtonIcon icon="phone" text={"0"}>0 mails envoyés</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>

            {prospect.negotiator && <HelpBubble ref={this.helpBubble} content={<ContentNegotiatorBubble elem={prospect.negotiator} />}>Négociateur</HelpBubble>}
        </div>
    }
}