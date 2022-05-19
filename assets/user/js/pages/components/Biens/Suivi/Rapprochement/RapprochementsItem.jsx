import React, { Component } from "react";


import { HelpBubble } from "@dashboardComponents/Tools/HelpBubble";
import { ButtonIcon } from "@dashboardComponents/Tools/Button";

import Helper        from "@commonComponents/functions/helper";
import Sanitaze      from "@commonComponents/functions/sanitaze";
import Rapprochement from "@userComponents/functions/rapprochement";

import { MailAsideButton }          from "@dashboardPages/components/Mails/MailAside";
import { SearchInfos }              from "@dashboardPages/components/Immo/Prospects/ProspectsItem";
import { NegotiatorBubble }         from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import { ContentNegotiatorBubble }  from "@userPages/components/Biens/AdCard";
import { ButtonBonVisite }          from "@dashboardPages/components/Immo/Visits/VisitsList";

const STATUS_PROPAL = 0;
const STATUS_ACCEPT = 1;
const STATUS_REFUSE = 2;

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
        const { elem, prospect, bien, offer, onSelectProspect, onChangeContext, onDeleteOffer, onSwitchStatusOffer } = this.props;

        let percentage = 0;
        if(prospect.search){
            let biens, compteur;
            [biens, compteur] = Rapprochement.rapprochement(prospect.search, [bien]);

            percentage = Helper.countProgress(compteur, 14)
        }


        return <div className="card-ra">
            <div className="selector">
                {elem && <ButtonIcon icon="cancel" onClick={() => onSelectProspect(prospect)}>Enlever</ButtonIcon>}
            </div>
            <div className="card-main">
                <div className="card-body">
                    <div className="infos">
                        <div className="col-1">
                            <div className="badges">
                                {elem ? <div className={"badge badge-" + elem.status}>{elem.statusString}</div> : <div className="badge badge-default">Possibilité</div>}
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
                            {elem && <div className="sub">{prospect.nbVisits} visite{prospect.nbVisits > 1 ? "s" : ""} au total</div>}
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    {elem ? <>
                        {offer && <div className="offer">
                            <div>
                                Offre proposée : <span className="pricePropal">{Sanitaze.toFormatCurrency(offer.pricePropal)}</span>
                            </div>
                            {offer.status === STATUS_REFUSE ? <div className="offer-answer txt-danger">Offre refusée</div> : null}
                            {offer.status === STATUS_ACCEPT ? <div className="offer-answer txt-primary">Offre acceptée</div> : null}
                        </div>}

                        <div className="footer-actions">
                            <div className="actions">
                                {!offer && <ButtonIcon icon="receipt-edit" onClick={() => onChangeContext("create-offer", prospect)} text="Faire une offre" />}
                                {(offer && offer.status === STATUS_PROPAL) && <>
                                    <ButtonIcon icon="check" text="Accepter" onClick={() => onChangeContext("accept-offer", prospect, offer)} />
                                    <ButtonIcon icon="cancel" text="Refuser" onClick={() => onSwitchStatusOffer(offer, STATUS_REFUSE)} />
                                    <ButtonIcon icon="receipt-edit" text="Modifier" onClick={() => onChangeContext("update-offer", prospect, offer)} />
                                    <ButtonIcon icon="trash" text="Supprimer" onClick={() => onDeleteOffer(offer)}/>
                                </>}
                                {(elem.status !== 3 && offer && offer.status !== STATUS_PROPAL) && <>
                                    <ButtonIcon icon="cancel" text="Rétablir l'offre" onClick={() => onSwitchStatusOffer(offer, STATUS_PROPAL)} />
                                </>}
                                {(elem.status !== 3 && offer && offer.status === STATUS_ACCEPT) && <>
                                    <ButtonIcon icon="flag" text="Finaliser l'offre" onClick={() => onChangeContext("final-offer", prospect, offer)} />
                                </>}
                            </div>
                            <div className="actions">
                                <ButtonIcon icon="map" tooltipWidth={120} onClick={() => onChangeContext("create-visit", prospect)} >Programmer une visite</ButtonIcon>
                                <ButtonBonVisite type="icon" tooltipWidth={70} from="suivi" id={elem.id}>Bon de visite</ButtonBonVisite>
                                <MailAsideButton txtBtn="Envoyer un mail" tooltipWidth={90} title={"Envoyer un mail à " + prospect.fullname} to={[prospect.email]} />
                            </div>
                        </div>
                    </> : <>
                        <div className="footer-actions">
                            <div className="actions">
                                <ButtonIcon icon="add-square" text="Ajouter à la liste 'A traiter'" onClick={() => onSelectProspect(prospect)} />
                            </div>
                        </div>
                    </>}
                </div>
            </div>

            {prospect.negotiator && <HelpBubble ref={this.helpBubble} content={<ContentNegotiatorBubble elem={prospect.negotiator} />}>Négociateur</HelpBubble>}
        </div>
    }
}
