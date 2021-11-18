import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {Input, Checkbox, Radiobox} from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_users_create";
const URL_UPDATE_GROUP       = "api_users_update";

export function BienFormulaire ({ type, onUpdateList, element })
{
    let title = "Ajouter un bien";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau bien !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        title={title}
        context={type}
        url={url}
        codeTypeAd={element ? element.codeTypeAd : ""}
        onUpdateList={onUpdateList}
        messageSuccess={msg}
    />

    return <div className="main-content">
        {form}
    </div>
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeTypeAd: props.codeTypeAd,
            errors: [],
            step: 1
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value})
    }

    handleNext = (step) => { this.setState({ step }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { codeTypeAd } = this.state;

        this.setState({ success: false})

        let paramsToValidate = [
            {type: "text", id: 'codeTypeAd',  value: codeTypeAd},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();

            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                    toastr.info(messageSuccess);
                    //message success + redirect to index
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { step, errors, codeTypeAd } = this.state;

        let steps = [
            {id: 1, label: "Informations globales"},
            {id: 2, label: "Details du bien"},
            {id: 3, label: "Localisation"},
            {id: 4, label: "Financier"},
            {id: 5, label: "Photos"},
            {id: 6, label: "Propriétaire"},
            {id: 7, label: "Publication"},
        ];

        let stepTitle = "Etape 1 : Informations globales";
        let stepsItems = [];
        {steps.forEach(el => {
            let active = "";
            if(el.id === step){
                active = " active";
                stepTitle = "Etape " + el.id + " : " + el.label;
            }
            stepsItems.push(<div className={"item" + active} key={el.id}>
                <span className="number">{el.id}</span>
                <span className="label">{el.label}</span>
            </div>)
        })}


        let typeAdItems = [
            { value: 0, label: 'Vente',                         identifiant: 'vente' },
            { value: 1, label: 'Location',                      identifiant: 'location' },
            { value: 2, label: 'Viager',                        identifiant: 'viager' },
            { value: 3, label: 'Cession de bail',               identifiant: 'cession-de-bail' },
            { value: 4, label: 'Produit d\'investissement',     identifiant: 'produit-investissement' },
            { value: 5, label: 'Location vacances',             identifiant: 'location-vacances' },
            { value: 6, label: 'Vente de prestige',             identifiant: 'vente-de-prestige' },
            { value: 7, label: 'Fond de commerce',              identifiant: 'fond-de-commerce' },
        ];

        return <div className="page-default">
            <div className="page-col-1">
                <div className="comeback">
                    <Button type="reverse" element="a" onClick={Routing.generate('user_biens')}>Retour à la liste</Button>
                </div>
                <div className="body-col-1">
                    <div className="title-col-1">
                        <span>Etapes :</span>
                    </div>
                    <div className="content-col-1 steps">
                        {stepsItems}
                    </div>
                </div>
            </div>
            <div className="page-col-2">
                <div className="title-col-2">
                    <div className="tab-col-2">
                        <div className="item active">{stepTitle}</div>
                    </div>
                    <Button type="warning">Enregistrer le brouillon</Button>
                </div>
                <section>
                    <form className="form-bien" onSubmit={this.handleSubmit}>
                        <div className={"step-section" + (step === 1 ? " active" : "")}>
                            <div className="line special-line">
                                <Radiobox items={typeAdItems} identifiant="codeTypeAd" valeur={codeTypeAd} errors={errors} onChange={this.handleChange}>
                                    Type d'annonce
                                </Radiobox>
                            </div>

                            <div className="line line-buttons">
                                <Button type="reverse">Etape précédente</Button>
                                <Button type="warning">Enregistrer le brouillon</Button>
                                <Button onClick={() => this.handleNext(2)}>Etape suivante</Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    }
}