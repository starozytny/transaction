import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {Button, ButtonIcon} from "@dashboardComponents/Tools/Button";
import parse from "html-react-parser";

export class AgenciesItem extends Component {
    render () {
        const { isUser, elem } = this.props;

        return <div className="profil-card">
            <div className="title">Description de {elem.name}</div>
            <div>
                {parse(elem.description)}
            </div>

            <div className="agency-data">
                <div className="item">
                    <div className="label">Type d'entreprise :</div>
                    <div>Data</div>
                </div>
                <div className="item">
                    <div className="label">SIRET :</div>
                    <div>Data</div>
                </div>
                <div className="item">
                    <div className="label">Numéro RCS :</div>
                    <div>Data</div>
                </div>
                <div className="item">
                    <div className="label">Carte professionnelle :</div>
                    <div>Data</div>
                </div>
                <div className="item">
                    <div className="label">Garantie financière :</div>
                    <div>Data</div>
                </div>
                <div className="item">
                    <div className="label">Affiliation :</div>
                    <div>Data</div>
                </div>
                <div className="item">
                    <div className="label">Adresse de la société :</div>
                    <div>{elem.address}, {elem.zipcode} {elem.city}</div>
                </div>
            </div>

            {!isUser && <div className="agency-data">
                <Button >Modifier des informations</Button>
            </div>}
        </div>
    }
}