import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Checkbox, Radiobox, TextArea } from "@dashboardComponents/Tools/Fields";
import { DatePick, DateTimePick } from "@dashboardComponents/Tools/DatePicker";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_agenda_slots_create";
const URL_UPDATE_GROUP       = "api_agenda_slots_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function AgendaFormulaire ({ type, onUpdateList, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau évènement !"

    if(type === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        name={element ? Formulaire.setValueEmptyIfNull(element.name) : ""}
        startAt={element ? Formulaire.setDateOrEmptyIfNull(element.startAtJavascript, "") : ""}
        endAt={element ? Formulaire.setDateOrEmptyIfNull(element.endAtJavascript, "") : ""}
        allDay={element ? Formulaire.setValueEmptyIfNull(element.allDay === true ? [1] : [0], [0]) : [0]}
        location={element ? Formulaire.setValueEmptyIfNull(element.location) : ""}
        comment={element ? Formulaire.setValueEmptyIfNull(element.comment) : ""}
        status={element ? Formulaire.setValueEmptyIfNull(element.status, 1) : 1}
        persons={element ? Formulaire.setValueEmptyIfNull(JSON.parse(element.persons), {}) : {}}
        onUpdateList={onUpdateList}
        messageSuccess={msg}
        key={element ? element.id : 0}
    />

    return <div className="form">
        {form}
    </div>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            startAt: props.startAt,
            endAt: props.endAt,
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
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "allDay"){
            value = (e.currentTarget.checked) ? [1] : [0] // parseInt because work with int this time
        }

        this.setState({ [name]: value })
    }

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, startAt } = this.state;

        this.setState({ success: false})

        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text", id: 'name',  value: name},
            {type: "text", id: 'startAt', value: startAt}
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
                        self.setState( {
                            name: "",
                            startAt: "",
                            endAt: "",
                            allDay: [0],
                            location: "",
                            comment: "",
                            status: 1,
                            persons: "",
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
        const { errors, success, name, startAt, endAt, allDay, location, comment, status } = this.state;

        let statusItems = [
            {value: 0, label: "Inactif", identifiant: "s-inactif"},
            {value: 1, label: "Actif",   identifiant: "s-actif"},
            {value: 2, label: "Annulé",  identifiant: "s-cancel"},
        ]

        let switcherItems = [ { value: 1, label: 'oui', identifiant: 'oui' } ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Radiobox items={statusItems} identifiant="status" valeur={status} errors={errors} onChange={this.handleChange}>
                        Statut
                    </Radiobox>
                </div>

                <div className="line line-2">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange}>Intitulé</Input>
                    <Input valeur={location} identifiant="location" errors={errors} onChange={this.handleChange}>Lieu de rendez-vous</Input>
                </div>

                <div className="line">
                    <Checkbox isSwitcher={true} items={switcherItems} identifiant="allDay" valeur={allDay} errors={errors} onChange={this.handleChange}>
                        Toute la journée
                    </Checkbox>
                </div>

                <div className="line line-2">
                    {allDay[0] === 1 ? <>
                            <DatePick identifiant="startAt" valeur={startAt} errors={errors} onChange={(e) => this.handleChangeDate("startAt", e)}>
                                Jour du rendez-vous
                            </DatePick>
                            <div className="form-group" />
                        </> : <>
                        <DateTimePick identifiant="startAt" valeur={startAt} errors={errors} onChange={(e) => this.handleChangeDate("startAt", e)}>
                            Début du rendez-vous
                        </DateTimePick>
                        <DateTimePick identifiant="endAt" valeur={endAt} errors={errors} onChange={(e) => this.handleChangeDate("endAt", e)}>
                            Fin du rendez-vous
                        </DateTimePick>
                    </>}
                </div>

                <div className="line">
                    <TextArea identifiant="comment" valeur={comment} errors={errors} onChange={this.handleChange}>Commentaire</TextArea>
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