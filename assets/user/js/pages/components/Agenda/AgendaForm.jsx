import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Checkbox }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_users_create";
const URL_UPDATE_GROUP       = "api_users_update";
const TXT_CREATE_BUTTON_FORM = "Ajouter l'utilisateur";
const TXT_UPDATE_BUTTON_FORM = "Modifier l'utilisateur";

export function AgendaFormulaire ({ type, element })
{
    let title = "Ajouter un évènement";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau évènement !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        name={element ? Formulaire.setValueEmptyIfNull(element.name) : ""}
        startAtJavascript={element ? Formulaire.setDateOrEmptyIfNull(element.startAtJavascript, "") : ""}
        endAtJavascript={element ? Formulaire.setDateOrEmptyIfNull(element.endAtJavascript, "") : ""}
        allDay={element ? Formulaire.setValueEmptyIfNull(element.allDay, 0) : 0}
        location={element ? Formulaire.setValueEmptyIfNull(element.location) : ""}
        comment={element ? Formulaire.setValueEmptyIfNull(element.comment) : ""}
        status={element ? Formulaire.setValueEmptyIfNull(element.status, 1) : 1}
        persons={element ? Formulaire.setValueEmptyIfNull(element.persons, {}) : {}}
        messageSuccess={msg}
    />

    return <div className="form">
        <h2>{title}</h2>
        {form}
    </div>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            startAtJavascript: props.startAtJavascript,
            endAtJavascript: props.endAtJavascript,
            allDay: props.allDay,
            location: props.location,
            comment: props.comment,
            status: props.status,
            persons: props.persons,
            errors: [],
            success: false
        }

        this.inputAvatar = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { username, firstname, lastname, password, passwordConfirm, email, roles } = this.state;

        this.setState({ success: false})

        let paramsToValidate = [
            {type: "text", id: 'username',  value: username},
            {type: "text", id: 'firstname', value: firstname},
            {type: "text", id: 'lastname',  value: lastname},
            {type: "email", id: 'email',    value: email},
            {type: "array", id: 'roles',    value: roles}
        ];
        if(context === "create" || context === "profil"){
            if(password !== ""){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }
        }

        let inputAvatar = this.inputAvatar.current;
        let avatar = inputAvatar ? inputAvatar.drop.current.files : [];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
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
                        self.setState( {
                            username: '',
                            firstname: '',
                            lastname: '',
                            email: '',
                            roles: [],
                            password: '',
                            passwordConfirm: '',
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

    render () {
        const { context } = this.props;
        const { errors, success } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}