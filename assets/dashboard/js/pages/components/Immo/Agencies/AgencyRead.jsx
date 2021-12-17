import React, { Component } from 'react';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import Sanitize               from "@commonComponents/functions/sanitaze";
import parse                  from "html-react-parser";

import { ChartAds, ChartBiens } from "@dashboardPages/components/Immo/Stats/Charts";

export class AgencyRead extends Component {
    render () {
        const { element, onChangeContext } = this.props;

        let statsAds = null, statsBiens = null;
        let last = 0;
        // let last = element.stats.length;
        // if(last > 0){
        //     statsAds = <ChartAds donnees={JSON.stringify(element.stats)} />;
        //     statsBiens = <ChartBiens donnees={JSON.stringify([element.stats[last - 1]])} />
        // }

        let logo = (element.logo) ? "/immo/logos/" + element.logo : `https://robohash.org/${element.id}?size=64x64`;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item">
                        <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                    </div>
                </div>

                <div className="item-user-read item-agency-read">

                    <div className="user-read-infos">
                        <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', element)} >Modifier</ButtonIcon>
                        </div>
                        <div className="user-read-infos-container">
                            <div className="avatar">
                                <img src={logo} alt={`Logo de ${element.name}`}/>
                            </div>

                            <div className="main-infos">
                                <div className="name">
                                    <div>#{element.id}</div>
                                    <span>{element.name}</span>
                                </div>
                                <div className="sub">{element.description ? parse(element.description) : "Description vide."}</div>
                                <div className="sub sub-contact">
                                    {element.email && <div><u>Email</u> : {element.email}</div>}
                                    {element.emailLocation && <div><u>Email location</u> : {element.emailLocation}</div>}
                                    {element.emailVente && <div><u>Email vente</u> : {element.emailVente}</div>}
                                </div>
                                <div className="sub sub-contact">
                                    {element.phone && <div><u>Téléphone</u> : {Sanitize.toFormatPhone(element.phone)}</div>}
                                    {element.phoneLocation && <div><u>Téléphone location</u> : {Sanitize.toFormatPhone(element.phoneLocation)}</div>}
                                    {element.phoneVente && <div><u>Téléphone vente</u> : {Sanitize.toFormatPhone(element.phoneVente)}</div>}
                                </div>
                                <div className="sub sub-contact">
                                    <div><u>Adresse</u> : {element.address}, {element.zipcode} {element.city}</div>
                                </div>
                                <div className="sub sub-contact">
                                    <div><u>Type d'entreprise</u> : {setData(element.type)}</div>
                                    <div><u>SIRET</u> : {setData(element.siret)}</div>
                                    <div><u>Numéro RCS</u> : {setData(element.rcs)}</div>
                                    <div><u>Carte professionnelle</u> : {setData(element.cartePro)}</div>
                                    <div><u>Garantie financière</u> : {setData(element.garantie)}</div>
                                    <div><u>Affiliation</u> : {setData(element.affiliation)}</div>
                                    <div><u>Médiation</u> : {setData(element.mediation)}</div>
                                </div>
                            </div>

                            <div className="footer-infos">
                                <div className="role role-time">
                                    <ButtonIcon target="_blank" element="a" onClick={element.website} icon="link-2">Website</ButtonIcon>
                                    <ButtonIcon target="_blank" element="a" onClick={"/immo/tarifs/" + element.tarif} icon="file">Tarifs</ButtonIcon>
                                </div>
                                <div className="role">{element.dirname}</div>
                            </div>
                        </div>
                    </div>

                    <div className="agency-stats">
                        <div className="title">Annonces immobilières</div>
                        <div className="chart">
                            {statsAds}
                        </div>
                    </div>

                </div>

                <div>
                    {statsBiens}
                </div>
            </div>
        </>
    }
}

function setData (value)
{
    return value ? value : "/";
}