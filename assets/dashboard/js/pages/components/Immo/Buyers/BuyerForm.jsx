import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { DatePick }            from "@dashboardComponents/Tools/DatePicker";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

import { SelecteurNegociateur } from "@dashboardPages/components/Immo/Elements/Selecteur";
import { LocalisationContact }  from "@dashboardPages/components/Immo/Elements/Contact";

const URL_CREATE_ELEMENT     = "api_buyers_create";
const URL_UPDATE_GROUP       = "api_buyers_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function BuyerFormulaire ({ type, onChangeContext, onUpdateList, element, isClient = false,
                                     societies, societyId = "", agencies, agencyId = "",
                                     negotiators, bienId="", isFromRead= false })
{
    let title = "Ajouter un acquéreur";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau acquéreur !"

    if(type === "update"){
        title = "Modifier " + element.fullname;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <BuyerForm
        context={type}
        url={url}
        society={element ? element.agency.society.id : societyId}
        agency={element ? element.agency.id : agencyId}
        negotiator={element ? (element.negotiator ? element.negotiator.id : "") : ""}
        lastname={element ? Formulaire.setValueEmptyIfNull(element.lastname) : ""}
        firstname={element ? Formulaire.setValueEmptyIfNull(element.firstname) : ""}
        civility={element ? Formulaire.setValueEmptyIfNull(element.civility, 0) : 0}
        phone1={element ? Formulaire.setValueEmptyIfNull(element.phone1) : ""}
        phone2={element ? Formulaire.setValueEmptyIfNull(element.phone2) : ""}
        phone3={element ? Formulaire.setValueEmptyIfNull(element.phone3) : ""}
        email={element ? Formulaire.setValueEmptyIfNull(element.email) : ""}
        address={element ? Formulaire.setValueEmptyIfNull(element.address) : ""}
        complement={element ? Formulaire.setValueEmptyIfNull(element.complement) : ""}
        zipcode={element ? Formulaire.setValueEmptyIfNull(element.zipcode) : ""}
        city={element ? Formulaire.setValueEmptyIfNull(element.city) : ""}
        country={element ? Formulaire.setValueEmptyIfNull(element.country, "France") : "France"}
        birthday={element ? Formulaire.setDateOrEmptyIfNull(element.birthdayJavascript, "") : ""}
        type={element ? Formulaire.setValueEmptyIfNull(element.type, 0) : 0}

        bienId={bienId}

        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        societies={societies}
        agencies={agencies}
        negotiators={negotiators}
        isClient={isClient}
    />

    return isFromRead ? <div className="form">{form}</div> : <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>

}

export class BuyerForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            society: props.society,
            agency: props.agency,
            negotiator: props.negotiator,
            lastname: props.lastname,
            firstname: props.firstname,
            civility: props.civility,
            phone1: props.phone1,
            phone2: props.phone2,
            phone3: props.phone3,
            email: props.email,
            address: props.address,
            complement: props.complement,
            zipcode: props.zipcode,
            city: props.city,
            country: props.country,
            birthday: props.birthday,
            type: props.type,

            bienId: props.bienId,

            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("lastname").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeSelect = (name, e) => {
        const { negotiator } = this.state;
        let nego = negotiator;
        if(name === "society" || name === "agency"){
            if(e === undefined){
                nego = "";
                let label = document.querySelector("label[for='negotiator'] + .react-selectize .simple-value > span");
                if(label){
                    label.innerHTML = "";
                }
            }
        }

        if(name !== "negotiator"){
            this.setState({ [name]: e !== undefined ? e.value : "", negotiator: nego })
        }else{
            this.setState({ [name]: e !== undefined ? e.value : ""})
        }

    }

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, society, agency, lastname, phone1, phone2, phone3, email } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ success: false});

            let method = context === "create" ? "POST" : "PUT";

            let paramsToValidate = [
                {type: "text",       id: 'society',   value: society},
                {type: "text",       id: 'agency',    value: agency},
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
                                society: "",
                                agency: "",
                                negotiator: "",
                                lastname: "",
                                firstname: "",
                                civility: 0,
                                phone1: "",
                                phone2: "",
                                phone3: "",
                                email: "",
                                address: "",
                                complement: "",
                                zipcode: "",
                                city: "",
                                country: "",
                                birthday: "",
                                type: 0,
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
        const { critere, errors, success, society, agency, negotiator, lastname, firstname, civility, birthday, type } = this.state;

        let civilityItems = [
            {value: 0, label: "Mr",      identifiant: "mr"},
            {value: 1, label: "Mme",     identifiant: "mme"}
        ]

        let typeItems = [
            {value: 0, label: "Aucun",          identifiant: "aucun-0"},
            {value: 1, label: "Investisseur",   identifiant: "investisseur"},
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
                            <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange}>Nom</Input>
                            <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange}>Prénom</Input>
                        </div>

                        <div className="line">
                            <DatePick identifiant="birthday" valeur={birthday} errors={errors} onChange={(e) => this.handleChangeDate("birthday", e)}>Date de naissance</DatePick>
                        </div>

                        <div className="line">
                            <Radiobox items={typeItems} identifiant="type" valeur={type} errors={errors} onChange={this.handleChange}>
                                Type d'acquéreur
                            </Radiobox>
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

                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}