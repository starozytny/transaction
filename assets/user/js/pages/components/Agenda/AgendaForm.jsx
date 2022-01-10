import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {
    Input,
    Checkbox,
    Radiobox,
    TextArea,
    SelectizeMultiple, SelectReactSelectize
} from "@dashboardComponents/Tools/Fields";

import { DatePick, DateTimePick } from "@dashboardComponents/Tools/DatePicker";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import {FormLayout} from "@dashboardComponents/Layout/Elements";

const URL_CREATE_ELEMENT     = "api_agenda_events_create";
const URL_UPDATE_GROUP       = "api_agenda_events_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function AgendaFormulaire ({ type, onUpdateList, onChangeContext, onDelete, custom, element, users, managers, negotiators,
                                      owners, tenants, prospects, biens, bienId ="", url_create=null, url_update=null })
{
    let title = "Ajouter une visite";
    let url = Routing.generate(url_create ? url_create : URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau évènement !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate(url_update ? url_update : URL_UPDATE_GROUP, {'id': element.id});
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
        bien={element ? (element.bien ? element.bien.id : bienId) : bienId}
        onUpdateList={onUpdateList}
        onDelete={onDelete}
        messageSuccess={msg}

        users={users}
        managers={managers}
        negotiators={negotiators}
        owners={owners}
        tenants={tenants}
        prospects={prospects}
        biens={biens}

        key={element ? element.id : (custom ? custom.dateStr : 0)}
    />

    return onChangeContext ? <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout> : <div className="form">{form}</div>
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
            managers: getPersonsData(props.persons ? props.persons.managers : []),
            negotiators: getPersonsData(props.persons ? props.persons.negotiators : []),
            owners: getPersonsData(props.persons ? props.persons.owners : []),
            tenants: getPersonsData(props.persons ? props.persons.tenants : []),
            prospects: getPersonsData(props.prospects ? props.persons.prospects : []),
            bien: props.bien,
            errors: [],
            success: false
        }

        this.selectMultiple = React.createRef();
        this.selectMultiple1 = React.createRef();
        this.selectMultiple2 = React.createRef();
        this.selectMultiple3 = React.createRef();
        this.selectMultiple4 = React.createRef();
        this.selectMultiple5 = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeSelectMultipleAdd = this.handleChangeSelectMultipleAdd.bind(this);
        this.handleChangeSelectMultipleDel = this.handleChangeSelectMultipleDel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleChangeSelectMultipleAdd = (name, valeurs) => {
        const { users, managers, negotiators, owners, tenants, prospects } = this.state;

        let donnees = getDataSelecteurFromName(this, name, users, managers, negotiators, owners, tenants, prospects);
        let selecteur = donnees[0];

        this.setState({ [name]: valeurs })
        selecteur.handleUpdateValeurs(valeurs);
    }

    handleChangeSelectMultipleDel = (name, valeur) => {
        const { users, managers, negotiators, owners, tenants, prospects } = this.state;

        let donnees = getDataSelecteurFromName(this, name, users, managers, negotiators, owners, tenants, prospects);
        let selecteur = donnees[0];
        let data = donnees[1];

        let valeurs = data.filter(v => v.value !== valeur.value);
        this.setState({ [name]: valeurs });
        selecteur.handleUpdateValeurs(valeurs);
    }

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
                            visibilities: [],
                            persons: [],
                            users: [],
                            managers: [],
                            negotiators: [],
                            owners: [],
                            tenants: [],
                            prospects: [],
                            bien: ""
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
        const { errors, success, name, startAt, endAt, allDay, location, comment, status, visibilities,
            users, managers, negotiators, owners, tenants, prospects } = this.state;

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

        let selectUsers         = getSelectData(this.props.users, "user");
        let selectManagers      = getSelectData(this.props.managers, "mana");
        let selectNegotiators   = getSelectData(this.props.negotiators, "nego");
        let selectOwners        = getSelectData(this.props.owners, "own");
        let selectTenants       = getSelectData(this.props.tenants, "tenant");
        let selectProspects     = getSelectData(this.props.prospects, "pros");
        return <>
            {(context === "update" && onDelete) && <div className="toolbar">
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


                <div className="line">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Évènement</div>
                        </div>
                    </div>
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
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Personnes concernées</div>
                        </div>
                    </div>
                </div>

                <div className="line line-2">
                    <Selecteur refSelecteur={this.selectMultiple} items={selectUsers} identifiant="users" valeur={users}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Utilisateurs concernés
                    </Selecteur>
                    <Selecteur refSelecteur={this.selectMultiple1} items={selectManagers} identifiant="managers" valeur={managers}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Managers concernés
                    </Selecteur>
                </div>
                <div className="line line-2">
                    <Selecteur refSelecteur={this.selectMultiple2} items={selectNegotiators} identifiant="negotiators" valeur={negotiators}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Negociateurs concernés
                    </Selecteur>
                    <Selecteur refSelecteur={this.selectMultiple5} items={selectProspects} identifiant="prospects" valeur={prospects}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Prospects concernés
                    </Selecteur>
                </div>
                <div className="line line-2">
                    <Selecteur refSelecteur={this.selectMultiple3} items={selectOwners} identifiant="owners" valeur={owners}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Propriétaires concernés
                    </Selecteur>
                    <Selecteur refSelecteur={this.selectMultiple4} items={selectTenants} identifiant="tenants" valeur={tenants}
                               errors={errors} onChangeAdd={this.handleChangeSelectMultipleAdd} onChangeDel={this.handleChangeSelectMultipleDel}>
                        Locataires concernés
                    </Selecteur>
                </div>

                <div className="line">
                    <Checkbox items={checkboxItems} identifiant="visibilities" valeur={visibilities} errors={errors} onChange={this.handleChange}>
                        Qui peut voir ce rendez-vous ?
                    </Checkbox>
                </div>

                <div className="line">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Détails de l'évènement</div>
                        </div>
                    </div>
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
        tab.push({ value: el.id, label: el.fullname, identifiant: pre + "-" + el.id })
    })

    return tab
}

function getPersonsData (data) {
    let tab = [];
    if(data){
        data.forEach(el => {
            tab.push({value: el.value, label: el.label})
        })
    }

    return tab;
}

function getDataSelecteurFromName (self, name, users, managers, negotiators, owners, tenants, prospects) {
    let data, selecteur;
    switch (name){
        case "prospects":
            data = prospects
            selecteur = self.selectMultiple5.current;
            break;
        case "tenants":
            data = tenants
            selecteur = self.selectMultiple4.current;
            break;
        case "owners":
            data = owners
            selecteur = self.selectMultiple3.current;
            break;
        case "negotiators":
            data = negotiators
            selecteur = self.selectMultiple2.current;
            break;
        case "managers":
            data = managers
            selecteur = self.selectMultiple1.current;
            break;
        default:
            data = users;
            selecteur = self.selectMultiple.current;
            break;
    }

    return [selecteur, data]
}