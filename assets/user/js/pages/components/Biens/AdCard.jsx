import React, { Component } from "react";

import axios        from "axios";
import Swal         from "sweetalert2";
import parse        from "html-react-parser";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { MailAside }        from "@dashboardPages/components/Mails/MailAside";
import { HelpBubble }       from "@dashboardComponents/Tools/HelpBubble";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

import Sanitaze     from "@commonComponents/functions/sanitaze";
import Formulaire   from "@dashboardComponents/functions/Formulaire";

const URL_CHANGE_STATUS = 'api_biens_status';

export class AdCard extends Component {
    constructor(props) {
        super();

        this.helpBubble = React.createRef();
        this.helpBubbleOwner = React.createRef();
        this.mail = React.createRef();

        this.handleOpenHelp = this.handleOpenHelp.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }

    handleOpenHelp = () => {
        this.helpBubble.current.handleOpen();
    }

    handleOpenOwner = () => {
        this.helpBubbleOwner.current.handleOpen();
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
        const { agencyId, isPublishePage=false, isOwnerPage=false, isProspectPage=false, rapprochements, follows, el, onDelete,
            onLinkToProspect, publishes, toPublishes, onSelectPublish, suivis, contractants, onOpenSuivi } = this.props;

        let items = [
            {data: <a target="_blank" href={Routing.generate('user_biens_suivi', {'slug': el.slug, "ct": "visites"})}>Liste des visites</a>},
            {data: <a target="_blank" href={Routing.generate('user_biens_suivi', {'slug': el.slug, "ct": "rapprochements"})}>Liste des prospects</a>},
            {data: <a onClick={() => this.mail.current.handleOpenAside("Envoyer un mail")}>Envoyer un mail</a>},
            {data: <a target="_blank" href={Routing.generate("user_printer_bien_display", {'slug': el.slug, "ori": "portrait"})}>Imprimer la fiche portrait</a>},
            {data: <a target="_blank" href={Routing.generate("user_printer_bien_display", {'slug': el.slug, "ori": "landscape"})}>Imprimer la fiche paysage</a>},
            {data: <a target="_blank" href={Routing.generate("user_printer_bien_rapport", {'slug': el.slug})}>Imprimer le rapport</a>}
        ]

        let itemsTrash = [
            {data: <a onClick={() => onDelete(el)}>Supprimer</a>},
            {data: <a onClick={() => this.handleChangeStatus(el, el.status !== 2 ? 2 : 0)}>{el.status !== 2 ? "Archiver" : "Désarchiver"}</a>}
        ]

        let followed = false;
        if(isProspectPage){
            follows.forEach(follow => {
                if(el.id === follow.bien.id){
                    followed = true;
                }
            })
        }

        let inSuivis = [];
        let nbSuivis = 0;
        if(suivis){
            suivis.forEach(su => {
                if(el.id === su.bien.id){
                    nbSuivis++;
                    inSuivis.push(su.prospect.id)
                }
            })
        }

        let owners = [];
        if(contractants){
            contractants.forEach(co => {
                if(el.id === co.contract.bien.id){
                    owners.push(co.owner)
                }
            })
        }

        let nbRapprochements = 0;
        if(rapprochements){
            rapprochements.forEach(ra => {
                if(el.id === ra.bien && !inSuivis.includes(ra.prospect)){
                    nbRapprochements++;
                }
            })
        }

        let supports = [];
        if(publishes){
            publishes.forEach(pu => {
                if(el.id === pu.bien.id){
                    supports.push(pu.support.name)
                }
            })
        }

        let activePublish = false;
        if(toPublishes){
            toPublishes.forEach(te => {
                if(el.id === te.id){
                    activePublish = true;
                }
            })
        }

        return <div className={"card-ad" + (el.isDraft ? " card-draft" : "")}>
            {isPublishePage && <div className="selector" onClick={() => onSelectPublish(el, activePublish)}>
                <label className={"item-selector " + activePublish}/>
            </div>}

            <div className="card-main">
                <div className="card-body">
                    {el.isDraft && <div className="isDraft"><div>Brouillon</div></div>}

                    <a className="image" href={Routing.generate('user_biens_suivi', {'slug': el.slug})}>
                        <img src={el.mainPhotoFile} alt="illustration"/>
                    </a>

                    <div className="infos">
                        <div className="col-1">
                            <div className="badges">
                                <div className="badge-bien badge">{el.typeAdString}</div>
                                <div className="badge-bien badge">{el.typeBienString}</div>
                            </div>
                            <a className="identifier" href={Routing.generate('user_biens_suivi', {'slug': el.slug})}>
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
                        <div className="col-2">
                            <div className="badges">
                                <div className={"badge-bien badge badge-" + el.status}
                                     onClick={((el.status === 1 || el.status === 0) && !isPublishePage && !isOwnerPage && !isProspectPage) ?
                                         () => this.handleChangeStatus(el, el.status === 1 ? 0 : 1) : null}>
                                    {el.statusString}
                                </div>
                                <div className="badge-bien badge">Mandat {el.mandat.typeMandatString}</div>
                            </div>
                            <div className="identifier">
                                <div className="price">{Sanitaze.toFormatCurrency(el.financial.price)} {el.codeTypeAd === 1 ? "cc/mois" : ""}</div>
                                <div className="carac">{el.area.habitable}m² - {el.number.piece} pièce{el.number.piece > 1 ? "s" : ""}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="references">{el.agency.code}</div>
                            <div className="negociateurs-owners">
                                {owners.length !== 0 && <div className="negociateur" onClick={this.handleOpenOwner}>
                                    <div className="avatar"><span className={"icon-" + (owners.length > 1 ? "group" : "user")} /></div>
                                    <div className="tooltip">Propriétaire{owners.length > 1 ? "s" : ""}</div>
                                </div>}
                                <NegociatorBubble elem={el.negotiator} onOpen={this.handleOpenHelp} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    {isPublishePage && <div className="commentary">Diffusion sur : {supports.length > 0 ? supports.join().replaceAll(",", ", ")
                        : <span className="txt-danger">Aucune plateforme sélectionnée.</span>}</div>}

                    <div className="footer-actions">
                        {(!isPublishePage && el.confidential.commentary && el.agency.id === agencyId) ? <div className="createdAt">
                            {parse(el.confidential.commentary)}
                        </div> : <div className="createdAt" />}

                        <div className={"actions" + (isProspectPage && followed ? " followed" : "")}>
                            {(rapprochements && nbRapprochements > 0) &&
                                <ButtonIcon element="a" icon="group" tooltipWidth={160} text={""+nbRapprochements}
                                            onClick={Routing.generate('user_biens_suivi', {'slug': el.slug, "ct": "rapprochements", "ctra": "possibilities"})}>
                                {nbRapprochements} rapprochement{nbRapprochements > 1 ? "s" : ""} possible{nbRapprochements > 1 ? "s" : ""}
                            </ButtonIcon>}
                            {(suivis && nbSuivis > 0) &&
                                <ButtonIcon element="a" icon="group" tooltipWidth={150} text={""+nbSuivis}
                                            onClick={Routing.generate('user_biens_suivi', {'slug': el.slug, "ct": "rapprochements", "ctra": "processing"})}>
                                {nbSuivis} rapprochement{nbSuivis > 1 ? "s" : ""} en cours
                            </ButtonIcon>}

                            {isProspectPage && <ButtonIcon icon="star" tooltipWidth={90} onClick={() => onLinkToProspect(el)}>
                                {followed ? "Lié" : "Lier"} au prospect
                            </ButtonIcon>}

                            <ButtonIcon icon="follow" onClick={() => onOpenSuivi(el)}>Suivi</ButtonIcon>
                            {/*<ButtonIcon icon="follow" element="a" onClick={Routing.generate('user_biens_suivi', {'slug': el.slug})}>Suivi</ButtonIcon>*/}

                            {agencyId === el.agency.id && <>
                                <ButtonIcon icon="pencil" element="a" onClick={Routing.generate('user_biens_update', {'slug': el.slug})}>Modifier</ButtonIcon>

                                {(!isProspectPage && !isOwnerPage && !isPublishePage) && <ButtonIconDropdown icon="trash" items={itemsTrash}>Suppression</ButtonIconDropdown>}
                            </>}

                            <ButtonIconDropdown icon="dropdown" items={items}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <HelpBubble ref={this.helpBubble} content={<ContentNegotiatorBubble elem={el.negotiator} />}>Négociateur</HelpBubble>
            {owners.length !== 0 && <HelpBubble ref={this.helpBubbleOwner} content={<ContentOwnerBubble data={owners} />}>Propriétaire{owners.length > 1 ? "s" : ""}</HelpBubble>}
            <MailAside ref={this.mail} to={el.owner ? [el.owner.email] : []} />
        </div>
    }
}

export function NegociatorBubble ({ elem, onOpen }) {
    return <>
        <div className="negociateur" onClick={onOpen}>
            <div className="avatar">
                <img src={elem.avatarFile} alt="Avatar" />
            </div>
            <span className="tooltip">{elem.fullname}</span>
        </div>
    </>
}

export function ContentNegotiatorBubble ({ elem }) {
    return  <div>
        <div>#{elem.code} - {elem.fullname}</div>
        <p><br/></p>
        <div>{elem.phone}</div>
        <div>{elem.phone2}</div>
        <div>{elem.email}</div>
    </div>
}

function ContentOwnerBubble ({ data }) {
    return <div>
        {data.map(elem => {
            return <div key={elem.id}>
                <div>{elem.fullnameCivility}</div>
                <p><br/></p>
                <div>{elem.phone1}</div>
                <div>{elem.phone2}</div>
                <div>{elem.phone3}</div>
                <div>{elem.email}</div>
            </div>
        })}
    </div>
}
