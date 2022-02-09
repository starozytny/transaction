import React, { Component } from "react";

import axios        from "axios";
import Swal         from "sweetalert2";
import parse        from "html-react-parser";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { HelpBubble }       from "@dashboardComponents/Tools/HelpBubble";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

import Sanitaze     from "@commonComponents/functions/sanitaze";
import Formulaire   from "@dashboardComponents/functions/Formulaire";

const URL_CHANGE_STATUS = 'api_biens_status';

export class AdCard extends Component {
    constructor(props) {
        super();

        this.helpBubble = React.createRef();

        this.handleOpenHelp = this.handleOpenHelp.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }

    handleOpenHelp = () => {
        this.helpBubble.current.handleOpen();
    }

    handleChangeStatus = (elem, status) => {
        let title = "";
        switch (parseInt(status)){
            case 1:
                title = "Transférer ce bien en actif ?";
                break;
            case 0:
                title = elem.status === 2 ? "Désarchiver ce bien ?" : "Transférer ce bien en inactif ?";
                break;
            default:
                title = "Transférer ce bien aux archives ?";
                break;
        }

        const self = this;
        Swal.fire(SwalOptions.options(title, "" ))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios({ method: "PUT", url: Routing.generate(URL_CHANGE_STATUS, {'id': elem.id, 'status': status}), data: {} })
                        .then(function (response) {
                            self.props.onUpdateList(response.data, "update");
                        })
                        .catch(function (error) {
                            Formulaire.displayErrors(this, error)
                        })
                        .then(function () {
                            Formulaire.loader(false);
                        })
                    ;
                }
            })
        ;
    }

    render () {
        const { isOwnerPage=false, isProspectPage=false, rapprochements, follows, el, onDelete, onLinkToProspect } = this.props;

        let items = [
            {data: <a href={Routing.generate('user_biens_suivi', {'slug': el.slug, "ct": "visites"})} target="_blank">Liste des visites</a>},
            {data: <a href={Routing.generate('user_biens_suivi', {'slug': el.slug, "ct": "prospects"})} target="_blank">Liste des prospects</a>},
            {data: <a href={Routing.generate("user_mails_send", {'dest': [el.owner ? el.owner.email : ""]})} target="_blank">Envoyer un mail</a>},
            {data: <a href="/">Imprimer la fiche</a>}
        ]

        let itemsTrash = [
            {data: <a onClick={() => onDelete(el)}>Supprimer</a>},
            {data: <a onClick={() => this.handleChangeStatus(el, el.status !== 2 ? 2 : 0)}>{el.status !== 2 ? "Archiver" : "Désarchiver"}</a>}
        ]

       let contentHelpBubble = <div>
            <div>#{el.negotiator.code} - {el.negotiator.fullname}</div>
            <p><br/></p>
            <div>{el.negotiator.phone}</div>
            <div>{el.negotiator.phone2}</div>
            <div>{el.negotiator.email}</div>
        </div>

        let followed = false;
        if(isProspectPage){
            follows.forEach(follow => {
                if(follow.bien.id === el.id){
                    followed = true;
                }
            })
        }

        let nbRapprochements = 0;
        if(rapprochements){
            rapprochements.forEach(ra => {
                if(el.id === ra.bien){
                    nbRapprochements++;
                }
            })
        }

        return <div className={"card-ad" + (el.isDraft ? " card-draft" : "")}>
            {/*<Selector id={el.id} />*/}

            <div className="card-main">
                <div className="card-body">
                    {el.isDraft && <div className="isDraft"><div>Brouillon</div></div>}

                    <a className="image" href={Routing.generate('user_biens_read', {'slug': el.slug})}>
                        <img src={el.mainPhotoFile} alt="illustration"/>
                    </a>

                    <div className="infos">
                        <div className="col-1">
                            <div className="badges">
                                <div className={"status status-" + el.status}
                                     onClick={(el.status === 1 || el.status === 0) ? () => this.handleChangeStatus(el, el.status === 1 ? 0 : 1) : null}>{el.statusString}</div>
                                <div className="status">{el.typeBienString}</div>
                            </div>
                            <a className="identifier" href={Routing.generate('user_biens_read', {'slug': el.slug})}>
                                <div className="title">
                                    <span>{el.libelle}</span>
                                    {el.isPublished && <span className="online" />}
                                </div>
                                <div className="address">
                                    <div>{el.localisation.address}</div>
                                    <div>{el.localisation.zipcode}, {el.localisation.city}</div>
                                </div>
                            </a>
                        </div>
                        <a className="col-2" href={Routing.generate('user_biens_read', {'slug': el.slug})}>
                            <div className="badges">
                                <div className="status">{el.typeAdString}</div>
                                <div className="status">Mandat {el.mandat.typeMandatString}</div>
                            </div>
                            <div className="identifier">
                                <div className="price">{Sanitaze.toFormatCurrency(el.financial.price)} {el.codeTypeAd === 1 ? "cc/mois" : ""}</div>
                                <div className="carac">{el.area.total}m² - {el.number.piece} pièce{el.number.piece > 1 ? "s" : ""}</div>
                            </div>
                        </a>
                        <a className="col-3" href={Routing.generate('user_biens_read', {'slug': el.slug})}>
                            <div className="references">
                                <div>{el.reference}</div>
                                <div>GERANCE01</div>
                            </div>
                            <div className="negociateur" onClick={this.handleOpenHelp}>
                                <div className="avatar">
                                    <img src={el.negotiator.avatarFile} alt="Avatar" />
                                </div>
                                <span className="tooltip">{el.negotiator.fullname}</span>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="card-footer">
                    {el.confidential.commentary && <div className="commentary">{parse(el.confidential.commentary)}</div>}

                    <div className="footer-actions">
                        <div className="createdAt">
                            Ajouté le {el.createdAtString} par {el.createdBy} {el.updatedBy && ("- Modifié le " + el.updatedAtString + " par " + el.updatedBy)}
                        </div>
                        <div className={"actions" + (isProspectPage && followed ? " followed" : "")}>
                            {(rapprochements && nbRapprochements > 0) && <ButtonIcon icon="group" tooltipWidth={120} text={""+nbRapprochements}>
                                {nbRapprochements} rapprochement{nbRapprochements > 1 ? "s" : ""}
                            </ButtonIcon>}

                            {isProspectPage && <ButtonIcon icon="star" tooltipWidth={90} onClick={() => onLinkToProspect(el)}>
                                {followed ? "Lié" : "Lier"} au prospect
                            </ButtonIcon>}

                            <ButtonIcon icon="follow" element="a" target="_blank" onClick={Routing.generate('user_biens_suivi', {'slug': el.slug})}>Suivi</ButtonIcon>
                            <ButtonIcon icon="pencil" element="a" onClick={Routing.generate('user_biens_update', {'slug': el.slug})}>Modifier</ButtonIcon>
                            {(!isProspectPage && !isOwnerPage) && <ButtonIconDropdown icon="trash" items={itemsTrash}>Suppression</ButtonIconDropdown>}
                            <ButtonIconDropdown icon="dropdown" items={items}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Négociateur</HelpBubble>
        </div>
    }
}