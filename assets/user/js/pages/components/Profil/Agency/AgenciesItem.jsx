import React, { Component } from 'react';

import parse      from "html-react-parser";

import { Button } from "@dashboardComponents/Tools/Button";

function setData (value)
{
    return value ? value : "/";
}

export class AgenciesItem extends Component {
    render () {
        const { role, idAgency, isUser, elem, onChangeContext } = this.props;

        return <div className="profil-card">
            <div className="title">Description de {elem.name}</div>
            <div>
                {parse(elem.description)}
            </div>

            <div className="agency-data">
                <div className="item">
                    <div className="label">Type d'entreprise :</div>
                    <div>{setData(elem.type)}</div>
                </div>
                <div className="item">
                    <div className="label">SIRET :</div>
                    <div>{setData(elem.siret)}</div>
                </div>
                <div className="item">
                    <div className="label">Numéro RCS :</div>
                    <div>{setData(elem.rcs)}</div>
                </div>
                <div className="item">
                    <div className="label">Carte professionnelle :</div>
                    <div>{setData(elem.cartePro)}</div>
                </div>
                <div className="item">
                    <div className="label">Garantie financière :</div>
                    <div>{setData(elem.garantie)}</div>
                </div>
                <div className="item">
                    <div className="label">Affiliation :</div>
                    <div>{setData(elem.affiliation)}</div>
                </div>
                <div className="item">
                    <div className="label">Médiation :</div>
                    <div>{setData(elem.mediation)}</div>
                </div>
                <div className="item">
                    <div className="label">Adresse de la société :</div>
                    <div>{elem.address}, {elem.zipcode} {elem.city}</div>
                </div>
                <div className="item">
                    <div className="label">Site internet :</div>
                    <div><a href={"/" + elem.website}>{elem.website}</a></div>
                </div>
                <div className="item">
                    <div className="label">Téléphones :</div>
                    <div>
                        <div><u>Général</u> : {elem.phone}</div>
                        <div><u>Location</u> : {elem.phoneLocation}</div>
                        <div><u>Vente</u> : {elem.phoneVente}</div>
                    </div>
                </div>
                <div className="item">
                    <div className="label">Emails :</div>
                    <div>
                        <div><u>Général</u> : {elem.email}</div>
                        <div><u>Location</u> : {elem.emailLocation}</div>
                        <div><u>Vente</u> : {elem.emailVente}</div>
                    </div>
                </div>
            </div>

            {(!isUser && idAgency === elem.id && role !== "user") && <div className="agency-data">
                <Button onClick={() => onChangeContext("update", elem)}>Modifier des informations</Button>
            </div>}
        </div>
    }
}