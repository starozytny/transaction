import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Select, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_negotiators_create";
const URL_UPDATE_GROUP       = "api_negotiators_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function NegotiatorFormulaire ({ type, onChangeContext, onUpdateList, element, agencies, agencyId = "", isClient = false })
{
    let title = "Ajouter un négociateur";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté une nouveau négociateurs !"

    if(type === "update"){
        title = "Modifier " + element.lastname + " " + element.firstname;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <NegotiatorForm
        context={type}
        url={url}
        agency={element ? element.agency.id : agencyId}
        code={element ? element.code : ""}
        lastname={element ? element.lastname : ""}
        firstname={element ? element.firstname : ""}
        phone={element ? element.phone : ""}
        phone2={element ? element.phone2 : ""}
        email={element ? element.email : ""}
        transport={element ? element.transport : ""}
        immatriculation={element ? element.immatriculation : ""}
        avatar={element ? element.avatar : null}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        agencies={agencies}
        isClient={isClient}
    />

    return isClient ? <FormLayout url={Routing.generate('user_profil')} form={form} text="Retour à mon profil">{title}</FormLayout> :
            <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class NegotiatorForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agency: props.agency,
            code: props.code,
            lastname: props.lastname,
            firstname: props.firstname,
            phone: props.phone,
            phone2: props.phone2,
            email: props.email,
            transport: props.transport,
            immatriculation: props.immatriculation,
            avatar: props.avatar,
            errors: [],
            success: false,
            critere: ""
        }

        this.inputAvatar = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("lastname").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, agency, lastname, firstname, phone, phone2, email } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ success: false});

            let paramsToValidate = [
                {type: "text",       id: 'agency',    value: agency},
                {type: "text",       id: 'lastname',  value: lastname},
                {type: "text",       id: 'firstname', value: firstname},
                {type: "text",       id: 'email',     value: email},
                {type: "atLeastOne", id: 'phone',     value: phone, idCheck: 'phone2', valueCheck: phone2},
            ];

            let inputAvatar = this.inputAvatar.current;
            let avatar = inputAvatar ? inputAvatar.drop.current.files : [];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            console.log(validate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                let formData = new FormData();
                if(avatar[0]){
                    formData.append('avatar', avatar[0].file);
                }

                formData.append("data", JSON.stringify(this.state));

                axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
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
                                agency: "",
                                code: "",
                                lastname: "",
                                firstname: "",
                                phone: "",
                                phone2: "",
                                email: "",
                                transport: "",
                                immatriculation: "",
                                avatar: null
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
        const { context, agencies, isClient } = this.props;
        const { critere, errors, success, agency, lastname, firstname, phone, phone2, email, transport, immatriculation, avatar } = this.state;

        let selectAgency = [];
        if(!isClient){
            agencies.forEach(elem => {
                selectAgency.push({ value: elem.id, label: elem.name, identifiant: elem.name.toLowerCase() })
            });
        }

        let selectTransport = [
            {value: 1, label: "Pied",                       identifiant: "pied"},
            {value: 2, label: "Transport en commun",        identifiant: "commun"},
            {value: 3, label: "Voiture professionnelle",    identifiant: "Voiture professionnelle"},
            {value: 4, label: "Voiture personnelle",        identifiant: "Voiture personnelle"},
            {value: 5, label: "Deux roues professionnel",   identifiant: "Deux roues professionnel"},
            {value: 6, label: "Deux roues personnel",       identifiant: "Deux roues personnel"},
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                {!isClient && <div className="line">
                    <SelectReactSelectize items={selectAgency} identifiant="agency" valeur={agency}
                                          placeholder={"Sélectionner l'agence"}
                                          errors={errors} onChange={(e) => this.handleChangeSelect("agency", e)}
                    >
                        Agence
                    </SelectReactSelectize>
                </div>}

                <div className="line line-2">
                    <Drop ref={this.inputAvatar} identifiant="avatar" file={avatar} folder="avatars" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser un avatar" labelError="Seules les images sont acceptées.">Avatar (facultatif)</Drop>
                    <div className="form-group" />
                </div>

                <div className="line line-2">
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange}>Nom</Input>
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange}>Prénom</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                    <Input valeur={phone} identifiant="phone" errors={errors} onChange={this.handleChange}>Téléphone 1</Input>
                    <Input valeur={phone2} identifiant="phone2" errors={errors} onChange={this.handleChange}>Téléphone 2</Input>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line line-2">
                    <Select items={selectTransport} identifiant="transport" valeur={transport} errors={errors} onChange={this.handleChange}>Transport</Select>
                    <Input valeur={immatriculation} identifiant="immatriculation" errors={errors} onChange={this.handleChange}>Immatriculation</Input>
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