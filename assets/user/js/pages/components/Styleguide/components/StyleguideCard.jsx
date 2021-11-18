import React from "react";

import { Selector }   from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

export function StyleguideCard () {
    return (
        <section>
            <h2>Cards</h2>
            <div className="styleguide-items">
                <div className="interactions">
                    <AdCard status={0} statusName="Inactif"/>
                </div>
            </div>
            <div className="styleguide-items">
                <div className="interactions">
                    <AdCard status={1} statusName="Actif"/>
                </div>
            </div>
            <div className="styleguide-items">
                <div className="interactions">
                    <AdCard status={2} statusName="Brouillon"/>
                </div>
            </div>
            <div className="styleguide-items">
                <div className="interactions">
                    <AdCard status={3} statusName="Archive"/>
                </div>
            </div>
        </section>
    )
}

export function AdCard ({ status, statusName }) {
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
                            <div className="status">Location</div>
                            <div className="status">Mandat simple</div>
                        </div>
                        <div className="identifier">
                            <div className="price">590 € cc/mois</div>
                            <div className="carac">20m² - 1 pièce</div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="references">
                            <div>L001522</div>
                            <div>GER0012</div>
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
                        Ajouté le 03 nov. 2021 par Shanbo - Modifié le 05 nov. 2021 par Shanbo
                    </div>
                    <div className="actions">
                        <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                        <ButtonIcon icon="archive">Archive</ButtonIcon>
                        <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                        <ButtonIconDropdown icon="dropdown" items={items}>Menu</ButtonIconDropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
}