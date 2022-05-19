import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_FINAL_ELEMENT     = "api_offers_final";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function OfferFinalFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let url = Routing.generate(URL_FINAL_ELEMENT, {'id': element.id});
    let msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";

    let form = <OfferFinalForm
        context={type}
        url={url}
        priceFinal={Formulaire.setValueEmptyIfNull(element.priceFinal, element.pricePropal)}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <div className="form">{form}</div>
}

export class OfferFinalForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            priceFinal: props.priceFinal,
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, priceFinal } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ errors: [], success: false });

            let method = "PUT";

            let paramsToValidate = [
                {type: "text",       id: 'priceFinal',    value: priceFinal},
            ];

            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                axios({ method: method, url: url, data: this.state })
                    .then(function (response) {
                        Helper.toTop();

                        if(self.props.onUpdateList){
                            let offer = JSON.parse(response.data.offer);
                            let suivi = JSON.parse(response.data.suivi);

                            self.props.onUpdateList(offer, suivi, context);
                            self.props.onChangeContext("rapprochements");
                        }
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
        const { critere, errors, success, priceFinal } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Input valeur={priceFinal} type="number" step="any" identifiant="priceFinal" errors={errors} onChange={this.handleChange}>
                        Prix final
                    </Input>
                    <div className="form-group" />
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
