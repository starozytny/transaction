import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Sort                    from "@commonComponents/functions/sort";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_UPDATE_GROUP       = "api_owners_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function GenerauxFormulaire ({ type, element, negotiators })
{
    let url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    let msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";

    let form = <GenerauxForm
        context={type}
        url={url}
        negotiatorDefault={Formulaire.setValueEmptyIfNull(element.negotiatorDefault)}
        mandatMonthVente={Formulaire.setValueEmptyIfNull(element.mandatMonthVente)}
        mandatMonthLocation={Formulaire.setValueEmptyIfNull(element.mandatMonthLocation)}

        messageSuccess={msg}
        negotiators={negotiators}
    />

    return <div className="form">{form}</div>

}

class GenerauxForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            negotiatorDefault: props.negotiatorDefault,
            mandatMonthVente: props.mandatMonthVente,
            mandatMonthLocation: props.mandatMonthLocation,
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() { Helper.toTop(); }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : ""}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { critere, negotiatorDefault } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ errors: [], success: false });

            let paramsToValidate = [
                {type: "text", id: 'negotiatorDefault', value: negotiatorDefault},
            ];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                axios({ method: "PUT", url: url, data: this.state })
                    .then(function (response) {
                        Helper.toTop();
                        self.setState({ success: messageSuccess, errors: [] });
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
        const { context, negotiators } = this.props;
        const { critere, errors, success, negotiatorDefault, mandatMonthVente, mandatMonthLocation } = this.state;

        let selectNegotiator = [];
        negotiators.sort(Sort.compareLastname);
        negotiators.forEach(elem => {
            selectNegotiator.push({ value: elem.id, label: elem.fullname, identifiant: "nego-" + elem.id })
        })

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Informations générales</div>
                        </div>

                        <div className="line">
                            <SelectReactSelectize items={selectNegotiator} identifiant="negotiatorDefault" valeur={negotiatorDefault}
                                                  placeholder={"Sélectionner le négociateur"}
                                                  errors={errors} onChange={(e) => this.handleChangeSelect("negotiator", e)}
                            >
                                Négociateur par défaut
                            </SelectReactSelectize>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Mandats</div>
                        </div>

                        <div className="line line-2">
                            <Input valeur={mandatMonthVente} identifiant="mandatMonthVente" errors={errors} onChange={this.handleChange}>Durée en mois pour la vente</Input>
                            <Input valeur={mandatMonthLocation} identifiant="mandatMonthLocation" errors={errors} onChange={this.handleChange}>Durée en mois pour la location</Input>
                        </div>

                    </div>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>
                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}