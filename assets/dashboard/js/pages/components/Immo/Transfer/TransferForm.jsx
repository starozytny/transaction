import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_owners_create";
const TXT_CREATE_BUTTON_FORM = "Transférer";

export function TransferFormulaire ({ donnees })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Le transfert s'est bien déroulé !"

    let form = <Form
        context={"create"}
        url={url}
        agencies={JSON.parse(donnees)}
        messageSuccess={msg}
    />

    return <div className="form">
        <h2>Transfert</h2>
        {form}
    </div>

}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            from: "",
            to: "",
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { critere, from, to } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ errors: [], success: false });

            let paramsToValidate = [
                {type: "text",       id: 'from', value: from},
                {type: "text",       id: 'to',   value: to},
            ];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;
                axios({ method: "POST", url: url, data: this.state })
                    .then(function (response) {
                        Helper.toTop();

                        self.setState({ success: messageSuccess, errors: [], from: "", to: "" });
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
        const { context, agencies } = this.props;
        const { critere, errors, success, from, to } = this.state;

        let selectAgencies = [];
        agencies.forEach(agency => {
            selectAgencies.push({ value: agency.id, label: agency.name, id: "ag-" + agency.id })
        })

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">De</div>
                        </div>

                        <div className="line">
                            <SelectReactSelectize items={selectAgencies} identifiant="from" valeur={from} errors={errors}
                                                  onChange={(e) => this.handleChangeSelect('from', e)}>
                                Depuis l'agence
                            </SelectReactSelectize>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Vers</div>
                        </div>

                        <div className="line">
                            <SelectReactSelectize items={selectAgencies} identifiant="to" valeur={to} errors={errors}
                                                  onChange={(e) => this.handleChangeSelect('to', e)}>
                                Vers l'agence
                            </SelectReactSelectize>
                        </div>

                    </div>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{TXT_CREATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}
