import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_donnees_quartiers_create";
const URL_UPDATE_GROUP       = "api_donnees_quartiers_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

let arrayZipcodeSave = [];

export function QuartierFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter un quartier";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau quartier !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <QuartierForm
        context={type}
        url={url}
        name={element ? Formulaire.setValueEmptyIfNull(element.name) : ""}
        zipcode={element ? Formulaire.setValueEmptyIfNull(element.zipcode) : ""}
        city={element ? Formulaire.setValueEmptyIfNull(element.city) : ""}
        polygon={element ? Formulaire.setValueEmptyIfNull(element.polygon, []) : []}

        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>

}

export class QuartierForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            zipcode: props.zipcode,
            city: props.city,
            polygon: props.polygon,
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeZipcode = this.handleChangeZipcode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        Helper.getPostalCodes(this);
        document.getElementById("name").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeZipcode = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodeSave)
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, name } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ success: false});

            let method = context === "create" ? "POST" : "PUT"

            let paramsToValidate = [
                {type: "text", id: 'name', value: name},
            ];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                arrayZipcodeSave = this.state.arrayPostalCode;
                delete this.state.arrayPostalCode;

                axios({ method: method, url: url, data: this.state })
                    .then(function (response) {
                        let data = response.data;
                        Helper.toTop();

                        if(self.props.onUpdateList){
                            self.props.onUpdateList(data);
                        }

                        self.setState({ success: messageSuccess, errors: [] });
                        if(context === "create"){
                            toastr.info(messageSuccess);
                            self.setState( {
                                name: "",
                                polygon: [],
                            })
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
        const { critere, errors, success, name, zipcode, city } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input identifiant="name" valeur={name} errors={errors} onChange={this.handleChange}>Intitulé</Input>
                </div>

                <div className="line line-2">
                    <Input identifiant="zipcode" valeur={zipcode} errors={errors} onChange={this.handleChangeZipcode}>Code postal</Input>
                    <Input identifiant="city" valeur={city} errors={errors} onChange={this.handleChange}>Ville</Input>
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