import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox, Select } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import NegotiatorFunction      from "@commonComponents/functions/negotiator";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

import { SelecteurNegociateur } from "@dashboardPages/components/Immo/Elements/Selecteur";
import { LocalisationContact }  from "@dashboardPages/components/Immo/Elements/Contact";

const URL_CREATE_ELEMENT     = "api_owners_create";
const URL_UPDATE_GROUP       = "api_owners_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function SupportFormulaire ({ type, onChangeContext, onUpdateList, element, isClient = false,
                                     societies, societyId = "", agencies, agencyId = "",
                                     negotiators })
{
    let title = "Ajouter un propriétaire";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau propriétaire !"

    if(type === "update"){
        title = "Modifier " + element.lastname + " " + element.firstname;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <SupportForm
        context={type}
        url={url}
        society={element ? element.society.id : societyId}
        agency={element ? element.agency.id : agencyId}
        negotiator={element ? (element.negotiator ? element.negotiator.id : "") : ""}
        lastname={element ? Formulaire.setValueEmptyIfNull(element.lastname) : ""}
        firstname={element ? Formulaire.setValueEmptyIfNull(element.firstname) : ""}
        civility={element ? Formulaire.setValueEmptyIfNull(element.civility, 2) : 2}
        phone1={element ? Formulaire.setValueEmptyIfNull(element.phone1) : ""}
        phone2={element ? Formulaire.setValueEmptyIfNull(element.phone2) : ""}
        phone3={element ? Formulaire.setValueEmptyIfNull(element.phone3) : ""}
        email={element ? Formulaire.setValueEmptyIfNull(element.email) : ""}
        address={element ? Formulaire.setValueEmptyIfNull(element.address) : ""}
        complement={element ? Formulaire.setValueEmptyIfNull(element.complement) : ""}
        zipcode={element ? Formulaire.setValueEmptyIfNull(element.zipcode) : ""}
        city={element ? Formulaire.setValueEmptyIfNull(element.city) : ""}
        country={element ? Formulaire.setValueEmptyIfNull(element.country, "France") : "France"}
        category={element ? Formulaire.setValueEmptyIfNull(element.category, "") : ""}

        isCoIndivisaire={element ? (element.isCoIndivisaire ? 1 : 0) : 0}
        coLastname={element ? Formulaire.setValueEmptyIfNull(element.coLastname) : ""}
        coFirstname={element ? Formulaire.setValueEmptyIfNull(element.coFirstname) : ""}
        coPhone={element ? Formulaire.setValueEmptyIfNull(element.coPhone) : ""}
        coEmail={element ? Formulaire.setValueEmptyIfNull(element.coEmail) : ""}
        coAddress={element ? Formulaire.setValueEmptyIfNull(element.coAddress) : ""}
        coZipcode={element ? Formulaire.setValueEmptyIfNull(element.coZipcode) : ""}
        coCity={element ? Formulaire.setValueEmptyIfNull(element.coCity) : ""}

        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        societies={societies}
        agencies={agencies}
        negotiators={negotiators}
        isClient={isClient}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>

}

export class SupportForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            society: props.society,
            agency: props.agency,
            negotiator: props.negotiator,
            lastname: props.lastname,
            firstname: props.firstname,
            civility: props.civility ,
            phone1: props.phone1,
            phone2: props.phone2,
            phone3: props.phone3,
            email: props.email,
            address: props.address,
            complement: props.complement,
            zipcode: props.zipcode,
            city: props.city,
            country: props.country,
            category: props.category,

            isCoIndivisaire: props.isCoIndivisaire,
            coLastname: props.lastname,
            coFirstname: props.firstname,
            coPhone: props.phone1,
            coEmail: props.email,
            coAddress: props.address,
            coZipcode: props.zipcode,
            coCity: props.city,

            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("lastname").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeSelect = (name, e) => {
        NegotiatorFunction.changeSelectNegotiator(this, this.state.negotiator, name, e);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, society, lastname, phone1, phone2, phone3, email } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ success: false});

            let paramsToValidate = [
                {type: "text",       id: 'society',   value: society},
                {type: "text",       id: 'lastname',  value: lastname},
                {type: "text",       id: 'email',     value: email},
                {type: "atLeastOne", id: 'phone1',    value: phone1, idCheck: 'phone2', valueCheck: phone2},
                {type: "atLeastOne", id: 'phone1',    value: phone1, idCheck: 'phone3', valueCheck: phone3},
            ];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                let formData = new FormData();
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
                                lastname: "",
                                firstname: "",
                                civility: 2,
                                phone1: "",
                                phone2: "",
                                phone3: "",
                                email: "",
                                address: "",
                                complement: "",
                                zipcode: "",
                                city: "",
                                country: "",
                                category: "",
                                isCoIndivisaire: 0,
                                coLastname: "",
                                coFirstname: "",
                                coPhone: "",
                                coEmail: "",
                                coAddress: "",
                                coZipcode: "",
                                coCity: "",
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
        const { critere, errors, success, society, agency, negotiator, lastname, firstname, civility, category,
            isCoIndivisaire, coLastname, coFirstname, coPhone, coEmail, coAddress, coZipcode, coCity } = this.state;

        let coindivisaireItems = [
            {value: 1, label: "Oui", identifiant: "oui"},
            {value: 0, label: "Non", identifiant: "no"},
        ]

        let civilityItems = [
            {value: 0, label: "Mr",         identifiant: "mr"},
            {value: 1, label: "Mme",        identifiant: "mme"},
            {value: 2, label: "Société",    identifiant: "societe"}
        ]

        let selectCategory = [
            {value: 0, label: "Habitation",             identifiant: "habitation"},
            {value: 1, label: "Des murs",               identifiant: "des-murs"},
            {value: 2, label: "Du fond de commerce",    identifiant: "commerce"},
            {value: 3, label: "Location",               identifiant: "location"},
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Informations générales</div>
                        </div>

                        <div className="line">
                            <Radiobox items={civilityItems} identifiant="civility" valeur={civility} errors={errors} onChange={this.handleChange}>
                                Civilité
                            </Radiobox>
                        </div>

                        <div className="line line-2">
                            <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange}>
                                {parseInt(civility) !== 2 ? "Nom *" : "Raison sociale *"}
                            </Input>
                            {parseInt(civility) !== 2 ? <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange}>Prénom</Input>
                                : <div className="form-group" />}
                        </div>

                        <div className="line">
                            <Select items={selectCategory} identifiant="category" valeur={category} errors={errors} onChange={this.handleChange}>
                                Catégorie de propriétaire
                            </Select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Négociateur</div>
                        </div>

                        <SelecteurNegociateur {...this.props} onChangeSelect={this.handleChangeSelect} errors={errors}
                                              society={society} agency={agency} negotiator={negotiator}/>

                    </div>
                </div>

                <div className="line line-2">
                    <LocalisationContact {...this.state} onChange={this.handleChange} />
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line-separator">
                    <div className="title">Co-indivisaire</div>
                </div>

                <div className="line">
                    <Radiobox items={coindivisaireItems} identifiant="isCoIndivisaire" valeur={isCoIndivisaire} errors={errors} onChange={this.handleChange}>
                        Co-indivisaire ?
                    </Radiobox>
                </div>

                {parseInt(isCoIndivisaire) === 1 && <>
                    <div className="line line-2">
                        <div className="form-group">
                            <div className="line line-2">
                                <Input valeur={coLastname} identifiant="coLastname" errors={errors} onChange={this.handleChange}>Nom</Input>
                                <Input valeur={coFirstname} identifiant="coFirstname" errors={errors} onChange={this.handleChange}>Prénom</Input>
                            </div>

                            <div className="line line-2">
                                <Input valeur={coPhone} identifiant="coPhone" errors={errors} onChange={this.handleChange}>Téléphone</Input>
                                <Input valeur={coEmail} identifiant="coEmail" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                            </div>

                            <div className="line line-3">
                                <Input valeur={coAddress} identifiant="coAddress" errors={errors} onChange={this.handleChange}>Adresse</Input>
                                <Input valeur={coZipcode} identifiant="coZipcode" errors={errors} onChange={this.handleChange}>Code postal</Input>
                                <Input valeur={coCity} identifiant="coCity" errors={errors} onChange={this.handleChange}>Ville</Input>
                            </div>
                        </div>
                        <div className="form-group" />
                    </div>

                </>}

                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}