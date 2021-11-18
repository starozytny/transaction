import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Checkbox }     from "@dashboardComponents/Tools/Fields";
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
        codeTypeAd={element ? element.codeTypeAd : 0}
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value})
    }

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
        ]

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
                        {steps.map(el => {
                            return <div className={"item" + (el.id === step ? " active" : "")} key={el.id}>
                                <span className="number">{el.id}</span>
                                <span className="label">{el.label}</span>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div className="page-col-2">
                <div className="title-col-2">
                    <div className="tab-col-2">
                        <div className="item active">Etape 1 : Informations globales</div>
                    </div>
                    <Button type="warning">Enregistrer le brouillon</Button>
                </div>
                <section>
                    <form className="form-bien" onSubmit={this.handleSubmit}>
                        <div className="line">
                            <Input valeur={codeTypeAd} identifiant="codeTypeAd" errors={errors} onChange={this.handleChange} >Nom utilisateur</Input>
                        </div>

                        <div className="line">
                            <div className="form-button">
                                <Button isSubmit={true}>Etape suivante</Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    }
}