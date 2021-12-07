import React from "react";

import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Selector } from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

export function AdCard ({ el, status, statusName }) {
    let items = [
        {data: <a href="/">Envoyer un mail</a>},
        {data: <a href="/">Imprimer la fiche</a>}
    ]
    return <div className="card-ad">
        <Selector />

        <div className="card-main">
            <div className="card-body">
                <div className="image">
                    <img src="/build/user/images/menu.jpg" alt="illustration"/>
                </div>

                <div className="infos">
                    <div className="col-1">
                        <div className="badges">
                            <div className={"status status-" + status}>{statusName}</div>
                            <div className="status">Appartement</div>
                        </div>
                        <div className="identifier">
                            <div className="title">
                                <span>Appartement T4</span>
                                <span className="online" />
                            </div>
                            <div className="address">
                                <div>17 rue de la République</div>
                                <div>13001, Marseille</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="badges">
                            <div className="status">{el.typeAdString}</div>
                            <div className="status">Mandat simple</div>
                        </div>
                        <div className="identifier">
                            <div className="price">590 € cc/mois</div>
                            <div className="carac">20m² - 1 pièce</div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="references">
                            <div>L00152256</div>
                            <div>GERANCE01</div>
                        </div>
                        <div className="negociateur">
                            <div className="avatar">
                                <img src={`https://robohash.org/${Math.random()}?size=64x64`} alt="Avatar" />
                            </div>
                            <span className="tooltip">Shanbora Shhun</span>
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
                        <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                        <ButtonIconDropdown icon="dropdown" items={items}>Autres</ButtonIconDropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
}