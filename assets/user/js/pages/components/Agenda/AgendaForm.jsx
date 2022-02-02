import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {
    Input,
    Checkbox,
    Radiobox,
    TextArea,
    SelectizeMultiple
} from "@dashboardComponents/Tools/Fields";

import { DatePick, DateTimePick } from "@dashboardComponents/Tools/DatePicker";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_agenda_events_create";
const URL_UPDATE_GROUP       = "api_agenda_events_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function AgendaFormulaire ({ type, onUpdateList, onDelete, custom, element, users })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau évènement !"

    if(type === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let startAt = element ? Formulaire.setDateOrEmptyIfNull(element.startAtJavascript, "") : "";
    let allDay = element ? Formulaire.setValueEmptyIfNull(element.allDay === true ? [1] : [0], [0]) : [0];

    let form = <Form
        context={type}
        url={url}
        name={element ? Formulaire.setValueEmptyIfNull(element.name) : ""}
        startAt={custom ? custom.date : startAt}
        endAt={element ? Formulaire.setDateOrEmptyIfNull(element.endAtJavascript, "") : ""}
        allDay={custom ? (custom.allDay === true ? [1] : [0]) : allDay}
        location={element ? Formulaire.setValueEmptyIfNull(element.location) : ""}
        comment={element ? Formulaire.setValueEmptyIfNull(element.comment) : ""}
        status={element ? Formulaire.setValueEmptyIfNull(element.status, 1) : 1}
        visibilities={element ? Formulaire.setValueEmptyIfNull(element.visibilities, [0]) : [0]}
        persons={element ? Formulaire.setValueEmptyIfNull(element.persons, []) : []}
        onUpdateList={onUpdateList}
        onDelete={onDelete}
        messageSuccess={msg}
        users={users}
        key={element ? element.id : (custom ? custom.dateStr : 0)}
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
            visibilities: props.visibilities,
            persons: props.persons,
            users: getPersonsData(props.persons ? props.persons.users : []),
            errors: [],
            success: false
        }

        this.selectMultiple = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeSelectMultipleAdd = this.handleChangeSelectMultipleAdd.bind(this);
        this.handleChangeSelectMultipleDel = this.handleChangeSelectMultipleDel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        console.log("in")
    }

    handleChange = (e) => {
        const { visibilities } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "allDay"){
            value = (e.currentTarget.checked) ? [1] : [0] // parseInt because work with int this time
        }

        if(name === "visibilities"){
            value = parseInt(value);

            let nVisibilities = visibilities;
            if(value !== 1 && value !== 2){
                nVisibilities = visibilities.filter(v => {return v !== 1})
                nVisibilities = nVisibilities.filter(v => {return v !== 2})
            }else if(value === 1 || value === 2){
                nVisibilities = [];
            }

            value = Formulaire.updateValueCheckbox(e, nVisibilities, value);
        }

        this.setState({ [name]: value })
    }

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

    handleChangeSelectMultipleAdd = (name, valeurs) => {
        const { users } = this.state;

        let donnees = getDataSelecteurFromName(this, name, users);
        let selecteur = donnees[0];

        this.setState({ [name]: valeurs })
        selecteur.handleUpdateValeurs(valeurs);
    }

    handleChangeSelectMultipleDel = (name, valeur) => {
        const { users } = this.state;

        let donnees = getDataSelecteurFromName(this, name, users);
        let selecteur = donnees[0];
        let data = donnees[1];

        let valeurs = data.filter(v => v.value !== valeur.value);
        this.setState({ [name]: valeurs });
        selecteur.handleUpdateValeurs(valeurs);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, allDay, startAt, endAt } = this.state;

        this.setState({ errors: [], success: false })

        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",        id: 'name',  value: name},
            {type: "text",        id: 'startAt', value: startAt},
        ];

        if(allDay[0] === 0){
            paramsToValidate = [...paramsToValidate, ...[
                {type: "dateLimitHM", id: 'startAt', value: startAt, minH: 8, maxH: 22, minM: 0, maxM: 60}
            ]]

            if(endAt !== ""){
                let minH = startAt ? startAt.getHours() : 8;
                let minM = startAt ? startAt.getMinutes() : 0;
                paramsToValidate = [...paramsToValidate, ...[
                    {type: "dateLimitHM", id: 'endAt', value: endAt, minH: minH, maxH: 22, minM: minM, maxM: 60},
                    {type: "dateCompare", id: 'startAt', value: startAt, valueCheck: endAt}
                ]]
            }
        }

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
                            visibilities: [],
                            persons: [],
                            users: [],
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
        const { context, onDelete } = this.props;
        const { errors, success, name, startAt, endAt, allDay, location, comment, status, users, visibilities } = this.state;

        let checkboxItems = [
            { value: 0, label: 'Personnes concernées',    identifiant: 'v-related' },
            { value: 1, label: 'Moi seulement',           identifiant: 'v-only-me' },
            { value: 2, label: 'Tout le monde',           identifiant: 'v-all' },
            { value: 3, label: 'Tous les utilisateurs',   identifiant: 'v-users' },
            { value: 4, label: 'Tous les managers',       identifiant: 'v-managers' },
        ]

        let statusItems = [
            {value: 0, label: "Inactif", identifiant: "s-inactif"},
            {value: 1, label: "Actif",   identifiant: "s-actif"},
            {value: 2, label: "Annulé",  identifiant: "s-cancel"},
        ]

        let switcherItems = [ { value: 1, label: 'oui', identifiant: 'oui' } ]

        let selectUsers = getSelectData(this.props.users, "user");

        let minTimeStart = Helper.createTimeHoursMinutes(8);
        let maxTimeStart = Helper.createTimeHoursMinutes(22);
        let minTimeEnd   = startAt ? startAt : Helper.createTimeHoursMinutes(8);
        let maxTimeEnd   = Helper.createTimeHoursMinutes(22);

        return <>
            {context === "update" && <div className="toolbar">
                <div className="item">
                    <Button type="danger" onClick={onDelete}>Supprimer l'évènement</Button>
                </div>
            </div>}

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
                        <DateTimePick identifiant="startAt" valeur={startAt} errors={errors}
                                      minTime={minTimeStart} maxTime={maxTimeStart}
                                      onChange={(e) => this.handleChangeDate("startAt", e)}>
                            Début du rendez-vous
                        </DateTimePick>
                        <DateTimePick identifiant="endAt" valeur={endAt} errors={errors}
                                      minTime={minTimeEnd} maxTime={maxTimeEnd}
                                      onChange={(e) => this.handleChangeDate("endAt", e)}>
                            Fin du rendez-vous
                        </DateTimePick>
                    </>}
                </div>

                <div className="line">
                    <TextArea identifiant="comment" valeur={comment} errors={errors} onChange={this.handleChange}>Commentaire</TextArea>
                </div>

                <div className="line">
                    <Selecteur refSelecteur={this.selectMultiple} items={selectUsers} identifiant="users" valeur={users}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Utilisateurs concernés
                    </Selecteur>
                </div>

                <div className="line">
                    <Checkbox items={checkboxItems} identifiant="visibilities" valeur={visibilities} errors={errors} onChange={this.handleChange}>
                        Qui peut voir ce rendez-vous ?
                    </Checkbox>
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


function Selecteur ({ refSelecteur, items, identifiant, valeur, errors, onChangeAdd, onChangeDel, children }) {
    return <>
        <SelectizeMultiple ref={refSelecteur} items={items} identifiant={identifiant} valeur={valeur}
                           errors={errors}
                           onChangeAdd={(e) => onChangeAdd(identifiant, e)}
                           onChangeDel={(e) => onChangeDel(identifiant, e)}
        >
            {children} concernés
        </SelectizeMultiple>
    </>
}

function getSelectData (data, pre) {
    let tab = [];
    data.forEach(el => {
        tab.push({ value: el.id, label: el.fullname, identifiant: pre + "-" + el.id, email: el.email })
    })

    return tab
}

function getPersonsData (data) {
    let tab = [];
    if(data){
        data.forEach(el => {
            tab.push({ value: el.value, label: el.label, email: el.email })
        })
    }

    return tab;
}

function getDataSelecteurFromName (self, name, users) {
    let data, selecteur;
    switch (name){
        default:
            data = users;
            selecteur = self.selectMultiple.current;
            break;
    }

    return [selecteur, data]
}