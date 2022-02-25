import React, { Component } from "react";

import Cleave from 'cleave.js/react'

import Sanitaze   from "@commonComponents/functions/sanitaze"
import Formulaire from "@dashboardComponents/functions/Formulaire";
import Validateur from "@commonComponents/functions/validateur";

import { Input }  from "@dashboardComponents/Tools/Fields";
import { Button } from "@dashboardComponents/Tools/Button";

import { PageInfos2 } from "@userComponents/Layout/Page";

export class Financial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            price: 100000,
            notaire: 8783,
            apport: 20000,
            garantie: 2000,
            assurance: 2000,
            taux: 0.96,
            years: 7,
            mensualite: "",
            errors: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "price"){
            value = e.currentTarget.value !== "" ? parseFloat(e.currentTarget.value) : "";

            let nNotaire    = value !== "" ? Math.round(value * (8.783/100)) : "";
            let nApport     = value !== "" ? Math.round(value * (20/100)) : "";
            let nGarantie   = value !== "" ? Math.round(value * (2/100)) : "";
            let nAssurance  = value !== "" ? Math.round(value * (0.45/100)) : "";

            this.setState({ notaire: nNotaire, apport: nApport, garantie: nGarantie, assurance: nAssurance })
        }

        this.setState({ [name]: value })
    }

    handleSubmit = (e) => {
        const { price, notaire, apport, garantie, assurance, taux, years } = this.state;

        e.preventDefault();

        let paramsToValidate = [
            {type: "text",       id: 'price',   value: price},
            {type: "text",       id: 'notaire', value: notaire},
            {type: "text",       id: 'apport',  value: apport},
            {type: "text",       id: 'garantie',  value: garantie},
            {type: "text",       id: 'assurance',  value: assurance},
            {type: "text",       id: 'taux',    value: taux},
            {type: "text",       id: 'years',   value: years},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            let mensualite = ( ((price - apport + garantie + assurance) * ((taux/100)/12)) / (1 - ( Math.pow(1 + ((taux/100)/12), -(12*years)) )) )

            this.setState({ mensualite: Math.round(mensualite) })
        }
    }

    render () {
        const { errors, price, notaire, apport, garantie, assurance, taux, years, mensualite } = this.state;

        return <div className="main-content">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="content-col-1">
                            <PageInfos2 image="/build/user/images/calcul.png">
                                <p>
                                    Le simulateur de calcul de financement permet d’avoir un aperçu du montant d’un crédit ou le montant
                                    d’une mensualité en fonction de plusieurs variables :
                                    le taux, le montant, la mensualité et la durée de remboursement.
                                </p>
                            </PageInfos2>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <div className="form">
                        <form onSubmit={this.handleSubmit}>

                            <div className="line">
                                <div className="form-group">
                                    <div className="line-separator">
                                        <div className="title">Calcul de mensualités</div>
                                    </div>
                                </div>
                            </div>

                            <div className="line line-2">
                                <Input valeur={price} identifiant="price" errors={errors} onChange={this.handleChange}>Prix du bien</Input>
                                <Input valeur={notaire} identifiant="notaire" errors={errors} onChange={this.handleChange}>Frais de notaire</Input>
                            </div>

                            <div className="line line-2">
                                <Input valeur={apport} identifiant="apport" errors={errors} onChange={this.handleChange}>Apport</Input>
                                <div className="form-group" />
                            </div>

                            <div className="line line-2">
                                <Input valeur={garantie} identifiant="garantie" errors={errors} onChange={this.handleChange}>Frais garantie du prêt (environ 2%)</Input>
                                <Input valeur={assurance} identifiant="assurance" errors={errors} onChange={this.handleChange}>Frais assurance du prêt (environ 0.45%)</Input>
                            </div>

                            <div className="line line-2">
                                <Input valeur={taux} identifiant="taux" errors={errors} onChange={this.handleChange}>Taux du crédit</Input>
                                <Input valeur={years} identifiant="years" errors={errors} onChange={this.handleChange}>Durée du crédit en année</Input>
                            </div>

                            <div className="line">
                                <div className="form-button">
                                    <Button isSubmit={true}>Calculer</Button>
                                </div>
                            </div>

                            <div className="line line-buttons">
                                <div className="form-group">
                                    <label>Estimation mensuelle : <span className="txt-primary"><b>{Sanitaze.toFormatCurrency(mensualite)}</b></span></label>
                                </div>
                                <div className="form-group" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }
}