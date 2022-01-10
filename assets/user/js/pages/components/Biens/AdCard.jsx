import React, { Component } from "react";

import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { HelpBubble }       from "@dashboardComponents/Tools/HelpBubble";
import { Selector }         from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

import Sanitaze from "@commonComponents/functions/sanitaze";

export class AdCard extends Component {
    constructor(props) {
        super();

        this.helpBubble = React.createRef();

        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    handleOpenHelp = () => {
        this.helpBubble.current.handleOpen();
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


        return <div className="card-ad">
            <Selector id={el.id} />

            <div className="card-main">
                <div className="card-body">
                    <div className="image">
                        <img src="/build/user/images/menu.jpg" alt="illustration"/>
                    </div>

                    <div className="infos">
                        <div className="col-1">
                            <div className="badges">
                                <div className={"status status-" + el.status}>{el.statusString}</div>
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
                            <ButtonIcon icon="archive">Archive</ButtonIcon>
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