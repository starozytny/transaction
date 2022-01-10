import React, { Component } from "react";

import axios        from "axios";
import toastr       from "toastr";
import Swal         from "sweetalert2";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { HelpBubble }       from "@dashboardComponents/Tools/HelpBubble";
import { Selector }         from "@dashboardComponents/Layout/Selector";
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
        const { el, onDelete } = this.props;

        let items = [
            {data: <a href={Routing.generate('user_visits_bien_index', {'slug': el.slug})} target="_blank">Liste des visites</a>},
            {data: <a href="/">Envoyer un mail</a>},
            {data: <a href="/">Imprimer la fiche</a>}
        ]

        let contentHelpBubble = <div>
            <div>#{el.negotiator.code} - {el.negotiator.fullname}</div>
            <p><br/></p>
            <div>{el.negotiator.phone}</div>
            <div>{el.negotiator.phone2}</div>
            <div>{el.negotiator.email}</div>
        </div>


        return <div className={"card-ad" + (el.isDraft ? " card-draft" : "")}>
            {/*<Selector id={el.id} />*/}

            <div className="card-main">
                <div className="card-body">
                    {el.isDraft && <div className="isDraft"><div>Brouillon</div></div>}

                    <div className="image">
                        <img src="/build/user/images/menu.jpg" alt="illustration"/>
                    </div>

                    <div className="infos">
                        <div className="col-1">
                            <div className="badges">
                                <div className={"status status-" + el.status}
                                     onClick={(el.status === 1 || el.status === 0) ? () => this.handleChangeStatus(el, el.status === 1 ? 0 : 1) : null}>{el.statusString}</div>
                                <div className="status">{el.typeBienString}</div>
                            </div>
                            <div className="identifier">
                                <div className="title">
                                    <span>{el.libelle}</span>
                                    {el.isPublished && <span className="online" />}
                                </div>
                                <div className="address">
                                    <div>{el.localisation.address}</div>
                                    <div>{el.localisation.zipcode}, {el.localisation.city}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="badges">
                                <div className="status">{el.typeAdString}</div>
                                <div className="status">Mandat {el.typeMandatString}</div>
                            </div>
                            <div className="identifier">
                                <div className="price">{Sanitaze.toFormatCurrency(el.financial.price)} cc/mois</div>
                                <div className="carac">{el.area.total}m² - {el.number.piece} pièce{el.number.piece > 1 ? "s" : ""}</div>
                            </div>
                        </div>
                        <div className="col-3">
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
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="commentary">Commentaire : Les clés sont à récupérer auprès de Shanbo.</div>
                    <div className="footer-actions">
                        <div className="createdAt">
                            Ajouté le {el.createdAtString} par {el.createdBy} {el.updatedBy && ("- Modifié le " + el.updatedAtString + " par " + el.updatedBy)}
                        </div>
                        <div className="actions">
                            <ButtonIcon icon="pencil" element="a" onClick={Routing.generate('user_biens_update', {'slug': el.slug})}>Modifier</ButtonIcon>
                            {el.status !== 2 ? <ButtonIcon icon="archive" onClick={() => this.handleChangeStatus(el, 2)}>Archive</ButtonIcon>
                                : <ButtonIcon icon="layer" onClick={() => this.handleChangeStatus(el, 0)}>Désarchiver</ButtonIcon>}
                            <ButtonIcon icon="trash" onClick={() => onDelete(el)}>Supprimer</ButtonIcon>
                            <ButtonIconDropdown icon="dropdown" items={items}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Négociateur</HelpBubble>
        </div>
    }
}