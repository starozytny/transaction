import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, SelectizeMultiple } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_mails_create_advanced";
const URL_PREVIEW_ELEMENT    = "api_mails_preview";
const TXT_CREATE_BUTTON_FORM = "Envoyer";

export function MailFormulaire ({ type, users })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Le message a été envoyé !"

    let form = <Form
        context={type}
        url={url}
        users={users ? users : []}
        messageSuccess={msg}
    />

    return <div className="form">{form}</div>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emails: [],
            subject: "",
            title: "",
            message: {value: "", html: ""},
            errors: [],
            success: false
        }

        this.selectMultiple = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleChangeSelectMultipleAdd = (name, valeurs) => {
        this.setState({ [name]: valeurs })
        this.selectMultiple.current.handleUpdateValeurs(valeurs);
    }

    handleChangeSelectMultipleDel = (name, valeur) => {
        let valeurs = this.state.emails.filter(v => v.value !== valeur.value);
        this.setState({ [name]: valeurs });
        this.selectMultiple.current.handleUpdateValeurs(valeurs);
    }

    handlePreview = (e) => {
        e.preventDefault();

        Formulaire.loader(true);
        let self = this;

        let formData = new FormData();
        formData.append("data", JSON.stringify(this.state));

        axios({ method: "POST", url: Routing.generate(URL_PREVIEW_ELEMENT), data: formData, headers: {'Content-Type': 'multipart/form-data'} })
            .then(function (response) {
                let preview = document.getElementById("preview");
                preview.innerHTML = response.data
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        console.log(e)

        const { url, messageSuccess } = this.props;
        const { emails, subject, title, message } = this.state;

        this.setState({ errors: [], success: false })

        let paramsToValidate = [
            {type: "array", id: 'emails', value: emails},
            {type: "text",  id: 'subject',  value: subject},
            {type: "text",  id: 'title',    value: title},
            {type: "text",  id: 'message',  value: message}
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
                    Helper.toTop();
                    self.setState({ success: messageSuccess, errors: [] });
                    self.setState( {
                        emails: [],
                        subject: '',
                        title: '',
                        message: {value: "", html: ""},
                    })
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
        const { users } = this.props;
        const { errors, success, emails, subject, title, message } = this.state;

        let selectItems = [];
        if(users && users.length !== 0){
            users.forEach(el => {
                if(el.getHighRoleCode !== 1){
                    selectItems.push({ value: el.email, label: el.username, identifiant: 'us-' + el.id, test: "i" })
                }
            })
        }

        return <>
            <form >

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <SelectizeMultiple ref={this.selectMultiple} items={selectItems} identifiant="emails" valeur={emails}
                                       placeholder={"Sélectionner un/des emails"}
                                       errors={errors}
                                       onChangeAdd={(e) => this.handleChangeSelectMultipleAdd("emails", e)}
                                       onChangeDel={(e) => this.handleChangeSelectMultipleDel("emails", e)}
                                       createType={"email"}
                    >
                        Destinataires
                    </SelectizeMultiple>

                </div>

                <div className="line">
                    <Input identifiant="subject" valeur={subject} errors={errors} onChange={this.handleChange}>Objet</Input>
                </div>

                <div className="line line-2">
                    <Input identifiant="title" valeur={title} errors={errors} onChange={this.handleChange}>Titre du message</Input>
                    <div className="form-group" />
                </div>

                <div className="line">
                    <Trumb identifiant="message" valeur={message.value} errors={errors} onChange={this.handleChangeTrumb}>Message</Trumb>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={false} outline={true} type="default" onClick={this.handlePreview}>Prévisualisation</Button>
                        <Button isSubmit={false} onClick={this.handleSubmit}>{TXT_CREATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}
