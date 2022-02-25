import React, { Component } from "react";

import Sanitaze   from "@commonComponents/functions/sanitaze"
import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Input }  from "@dashboardComponents/Tools/Fields";
import { Button } from "@dashboardComponents/Tools/Button";

import { PageInfos2 } from "@userComponents/Layout/Page";

export class Financial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            price: "100000",
            notaire: "8783",
            apport: "20000",
            garantie: "2000",
            assurance: "2000",
            taux: 0.96,
            years: "7",
            mensualite: "",
            errors: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCleave = this.handleChangeCleave.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeCleave = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.rawValue;

        value = Formulaire.setToFloat(value);

        if(name === "price"){

            let nNotaire    = value !== "" ? Math.round(value * (8.783/100)) : "";
            let nApport     = value !== "" ? Math.round(value * (20/100)) : "";
            let nGarantie   = value !== "" ? Math.round(value * (2/100)) : "";
            let nAssurance  = value !== "" ? Math.round(value * (0.45/100)) : "";

            this.setState({ notaire: nNotaire, apport: nApport, garantie: nGarantie, assurance: nAssurance })
        }

        this.setState({ [name]: value })
    }

    handleChange = (e) => {
        this.setState({ [e.currentTarget.name]: e.currentTarget.value })
    }

    handleSubmit = (e) => {
        const { price, notaire, apport, garantie, assurance, taux, years } = this.state;

        e.preventDefault();

        this.setState({ errors: [] })

        let nPrice = Formulaire.setToFloat(price);
        let nNotaire = Formulaire.setToFloat(notaire);
        let nApport = Formulaire.setToFloat(apport);
        let nGarantie = Formulaire.setToFloat(garantie);
        let nAssurance = Formulaire.setToFloat(assurance);
        let nTaux = Formulaire.setToFloat(taux);
        let nYears = Formulaire.setToFloat(years);

        let mensualite = ( ((nPrice - nApport + nNotaire + nGarantie + nAssurance) * ((nTaux/100)/12)) / (1 - ( Math.pow(1 + ((nTaux/100)/12), -(12*nYears)) )) )

        this.setState({ mensualite: Math.round(mensualite) })
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
                                <Input type="cleave" valeur={price} identifiant="price" errors={errors} onChange={this.handleChangeCleave}>Prix du bien</Input>
                                <Input type="cleave" valeur={notaire} identifiant="notaire" errors={errors} onChange={this.handleChangeCleave}>Frais de notaire</Input>
                            </div>

                            <div className="line line-2">
                                <Input type="cleave" valeur={apport} identifiant="apport" errors={errors} onChange={this.handleChangeCleave}>Apport</Input>
                                <div className="form-group" />
                            </div>

                            <div className="line line-2">
                                <Input type="cleave" valeur={garantie} identifiant="garantie" errors={errors} onChange={this.handleChangeCleave}>Frais garantie du prêt (environ 2%)</Input>
                                <Input type="cleave" valeur={assurance} identifiant="assurance" errors={errors} onChange={this.handleChangeCleave}>Frais assurance du prêt (environ 0.45%)</Input>
                            </div>

                            <div className="line line-2">
                                <Input type="number" valeur={taux} identifiant="taux" errors={errors} onChange={this.handleChange}>Taux du crédit</Input>
                                <Input type="cleave" valeur={years} identifiant="years" errors={errors} onChange={this.handleChangeCleave}>Durée du crédit en année</Input>
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