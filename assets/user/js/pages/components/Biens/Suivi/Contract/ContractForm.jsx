import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Select }       from "@dashboardComponents/Tools/Fields";
import { DatePick }            from "@dashboardComponents/Tools/DatePicker";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_contracts_create";
const URL_UPDATE_GROUP       = "api_contracts_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function ContractFormulaire ({ type, onChangeContext, onUpdateList, element, bien, prospect })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez finalisé l'offre !"

    if(type === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <ContractForm
        context={type}
        url={url}
        bien={bien}
        prospect={prospect}
        sellAt={element ? Formulaire.setDateOrEmptyIfNull(element.sellAtJavascript) : new Date()}
        sellBy={element ? Formulaire.setValueEmptyIfNull(element.sellBy, 1) : 1}
        sellWhy={element ? Formulaire.setValueEmptyIfNull(element.sellWhy, 1) : 1}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <div className="form">{form}</div>
}

class ContractForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bien: props.bien,
            prospect: props.prospect,
            sellAt: props.sellAt,
            sellBy: props.sellBy,
            sellWhy: props.sellWhy,
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("sellBy").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeDate = (name, e) => { this.setState({ [name]: e }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, sellAt, sellBy, sellWhy } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ errors: [], success: false });

            let method = context === "create" ? "POST" : "PUT";

            let paramsToValidate = [
                {type: "date",       id: 'sellAt',    value: sellAt},
                {type: "text",       id: 'sellBy',    value: sellBy},
                {type: "text",       id: 'sellWhy',   value: sellWhy},
            ];

            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                axios({ method: method, url: url, data: this.state })
                    .then(function (response) {
                        location.reload();
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
    }

    render () {
        const { context } = this.props;
        const { critere, errors, success, sellAt, sellBy, sellWhy } = this.state;

        let byItems = [
            { value: 0, label: 'Inconnu',       identifiant: 'by-inconnu' },
            { value: 1, label: 'Agence',        identifiant: 'agency' },
            { value: 2, label: 'Propriétaire',  identifiant: 'prop' },
            { value: 3, label: 'Concurrence',   identifiant: 'concu' },
        ]

        let whyItems = [
            { value: 0, label: 'Inconnu',       identifiant: 'why-inconnu' },
            { value: 1, label: 'Offre achat',   identifiant: 'offre' },
            { value: 2, label: 'Compromis',     identifiant: 'compromis' },
            { value: 3, label: 'Vendu',         identifiant: 'vendu' },
            { value: 4, label: 'Annulé',        identifiant: 'annule' },
            { value: 5, label: 'Suspendu',      identifiant: 'suspendu' },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <DatePick identifiant="sellAt" valeur={sellAt} errors={errors} onChange={(e) => this.handleChangeDate('sallAt', e)}>Date de sortie</DatePick>
                    <div className="form-group" />
                </div>

                <div className="line line-2">
                    <Select items={byItems} identifiant="sellBy" valeur={sellBy} errors={errors} onChange={this.handleChange}>Sortie par ?</Select>
                    <Select items={whyItems} identifiant="sellWhy" valeur={sellWhy} errors={errors} onChange={this.handleChange}>Motif de sortie </Select>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}