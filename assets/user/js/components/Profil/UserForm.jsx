import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_UPDATE_GROUP       = "api_users_update";

export function UserFormulaire ({ type, element })
{
    let title = "Modifier " + element.username;
    let url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    let msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";

    let form = <Form
        context={type}
        url={url}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        messageSuccess={msg}
    />

    return <>
        <div className="toolbar">
            <div className="item">
                <Button element="a" outline={true} icon="left-arrow" type="primary" onClick={Routing.generate('user_profil')}>Retour à mon profil</Button>
            </div>
        </div>

        <div className="form">
            <h2>{title}</h2>
            {form}
        </div>
    </>
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            password: '',
            passwordConfirm: '',
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { firstname, lastname, password, passwordConfirm, email } = this.state;

        this.setState({ success: false})

        let paramsToValidate = [
            {type: "text", id: 'firstname', value: firstname},
            {type: "text", id: 'lastname',  value: lastname},
            {type: "email", id: 'email',    value: email}
        ];

        if(password !== ""){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
            ];
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate)
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
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

    render () {
        const { errors, success, firstname, lastname, email, password, passwordConfirm } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                </div>

                <div className="line line-2">
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom</Input>
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom</Input>
                </div>

                <Alert type="reverse">
                    Laisser le champs MOT DE PASSE vide, si vous ne souhaitez pas modifier votre mot de passe.
                </Alert>
                <div className="line">
                    <div className="password-rules">
                        <p>Règles de création de mot de passe :</p>
                        <ul>
                            <li>Au moins 12 caractères</li>
                            <li>Au moins 1 minuscule</li>
                            <li>Au moins 1 majuscule</li>
                            <li>Au moins 1 chiffre</li>
                            <li>Au moins 1 caractère spécial</li>
                        </ul>
                    </div>
                </div>
                <div className="line line-2">
                    <Input type="password" valeur={password} identifiant="password" errors={errors} onChange={this.handleChange} >Mot de passe (facultatif)</Input>
                    <Input type="password" valeur={passwordConfirm} identifiant="passwordConfirm" errors={errors} onChange={this.handleChange} >Confirmer le mot de passe</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>Enregistrer les modifications</Button>
                    </div>
                </div>
            </form>
        </>
    }
}