import React, { Component } from "react";

import axios             from "axios";
import toastr            from "toastr";
import Swal              from "sweetalert2";
import SwalOptions       from "@commonComponents/functions/swalOptions";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import frLocale          from '@fullcalendar/core/locales/fr';
import FullCalendar      from "@fullcalendar/react";
import dayGridPlugin     from '@fullcalendar/daygrid';
import timeGridPlugin    from '@fullcalendar/timegrid';
import listPlugin        from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import Formulaire        from "@dashboardComponents/functions/Formulaire";
import UpdateList        from "@dashboardComponents/functions/updateList";
import Sanitaze          from "@commonComponents/functions/sanitaze";
import AgendaData        from "./agendaData";

import { Aside }         from "@dashboardComponents/Tools/Aside";
import { Button }        from "@dashboardComponents/Tools/Button";

import { PageError }        from "@dashboardComponents/Layout/PageError";
import { LoaderElement }    from "@dashboardComponents/Layout/Loader";
import { AgendaFormulaire } from "@userPages/components/Agenda/AgendaForm";
import { Filter, FilterSelected } from "@dashboardComponents/Layout/Filter";
import { SelectReactSelectize }   from "@dashboardComponents/Tools/Fields";

const URL_DELETE_ELEMENT = 'api_agenda_events_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cet évènement ?';
const URL_UPDATE_ELEMENT_DATE = 'api_agenda_events_update_date';
const URL_GET_DATA            = 'api_agenda_data_persons';

function filterFunction(dataImmuable, filters, search = null) {
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                let push = false;
                switch (filter){
                    case "user":
                        if(el.persons && el.persons.users){
                            el.persons.users.forEach(u => {
                                if(parseInt(u.value) === parseInt(search)){
                                    push = true;
                                }
                            })
                        }
                        break;
                    case "all":
                        push = true;
                        break;
                    case 0: //users
                        if(el.persons && el.persons.users && el.persons.users.length > 0){
                            push = true;
                        }
                        break;
                    default:
                        break;
                }

                if(push){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }
            })
        })
    }

    return newData;
}

export class Agenda extends Component {
    constructor(props) {
        super(props);

        let data = props.donnees ? JSON.parse(props.donnees) : [];

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            dataImmuable: data,
            data: data,
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay",
            filters: [],
            errors: [],
            selActive: "",
            user: ""
        }

        this.aside = React.createRef();
        this.filter = React.createRef();

        this.handleOpenAside = this.handleOpenAside.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);

        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventDrop = this.handleEventDrop.bind(this);
        this.handleEventDidMount = this.handleEventDidMount.bind(this);
    }

    componentDidMount = () => {
        const { selActive, filters } = this.state;

        AgendaData.getData(this, URL_GET_DATA);
        if(selActive !== ""){
            this.handleChangeSelect(selActive, { value: this.state[selActive] })
        }
        if(selActive === "" && filters.length !== 0){
            this.handleGetFilters(filters)
        }
    }

    handleChangeSelect = (name, e) => {
        const { dataImmuable, filters } = this.state;

        let search = e !== undefined ? e.value : "";
        let newData = filterFunction(dataImmuable, search !== "" ? [name] : ["all"], search);
        let newData1 = filterFunction(newData, filters);

        this.setState({ data: newData1, filters: filters, [name]: search, selActive: search === "" ? "" : name });
    }

    handleGetFilters = (filters, dataIm = null) => {
        const { dataImmuable } = this.state;

        let newData = filterFunction(dataIm ? dataIm : dataImmuable, filters);

        this.setState({ data: newData, filters: filters });
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    handleOpenAside = (context, elem) => {
        let title = context === "update" ? elem.title : "Ajouter un évènement";

        let element = elem;
        if(context === "update"){
            element = AgendaData.createElement(elem);
        }

        this.setState({ context, element })
        this.aside.current.handleOpen(title);
    }

    handleUpdateList = (element, newContext=null) => {
        const { data, context } = this.state

        let nContext = (newContext !== null) ? newContext : context;
        let newData = UpdateList.update(nContext, data, element);

        if(nContext === "delete" && this.aside.current){
            this.aside.current.handleClose();
        }

        this.setState({
            data: newData,
            dataImmuable: newData,
            element: element
        })
    }

    // init event
    handleEventDidMount = (e) => {
        const { users, managers, negotiators, owners, tenants, prospects, buyers } = this.state;

        addEventElement(e.el, e.event, users, managers, negotiators, owners, tenants, prospects, buyers);
    }

    // move event
    handleEventDrop = (e) => {
        const { users, managers, negotiators, owners, tenants, prospects, buyers } = this.state;

        const self = this;
        Swal.fire(SwalOptions.options("Déplacer le rendez-vous", ""
            + e.event.title + "<br><br>"
            + "<u>Ancien date</u> : " + Sanitaze.toFormatDateTimeMidString(e.oldEvent.start) + "<br><br>"
            + "<u>Nouvelle date</u> : " + Sanitaze.toFormatDateTimeMidString(e.event.start)
        ))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios({ method: "PUT", url: Routing.generate(URL_UPDATE_ELEMENT_DATE, {'id': e.event.id}), data: {
                            startAt: e.event.start,
                            endAt: e.event.end
                        }})
                        .then(function (response) {
                            toastr.info("Données mises à jour");
                            addEventElement(e.el, e.event, users, managers, negotiators, owners, tenants, prospects, buyers);
                        })
                        .catch(function (error) {
                            toastr.error("Une erreur est survenue.");
                            e.revert();
                        })
                        .then(function () {
                            Formulaire.loader(false);
                        })
                    ;
                }else{
                    e.revert();
                }
            })
        ;
    }

    // edit event
    handleEventClick = (e) => {
        this.handleOpenAside("update", e.event)
    }

    // click in case empty
    handleDateClick = (e) => {
        this.handleOpenAside("create", e)
    }

    handleAdd = () => { this.handleOpenAside("create") }

    handleDelete = (element) => { // id is string
        let url = Routing.generate(URL_DELETE_ELEMENT, {'id': element.id})
        Formulaire.axiosDeleteElement(this, element, url, MSG_DELETE_ELEMENT, 'Cette action est irréversible.');
    }

    render () {
        const { context, errors, loadPageError, loadData, data, initialView, element,
            users, managers, negotiators, owners, tenants, prospects, buyers, biens,
            filters, selActive, user } = this.state;

        let contentAside;
        switch (context){
            case "create":
                contentAside = <AgendaFormulaire type="create" custom={element} refAside={this.aside}
                                                 users={users} managers={managers} negotiators={negotiators} owners={owners} tenants={tenants}
                                                 prospects={prospects} buyers={buyers} biens={biens}
                                                 onUpdateList={this.handleUpdateList}
                                                 />
                break;
            case "update":
                contentAside = <AgendaFormulaire type="update" element={element} refAside={this.aside}
                                                 users={users} managers={managers} negotiators={negotiators} owners={owners} tenants={tenants}
                                                 prospects={prospects} buyers={buyers} biens={biens}
                                                 onUpdateList={this.handleUpdateList} onDelete={() => this.handleDelete(element)} />
                break;
            default:
                break;
        }

        let events = [];
        data.forEach(elem => {
            events.push(AgendaData.createEventStructure(elem, elem.imVisit))
        })

        let filtersLabel = ["Utilisateur", "Développeur", "Administrateur"];
        let filtersId    = ["f-user", "f-dev", "f-admin"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0]},
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2]}
        ];

        let selectUsers = [];
        if(users){
            users.forEach(u => {
                selectUsers.push({ value: u.id, label: u.fullname, identifiant: "ag-se-" + u.id })
            });
        }

        return <>
            {loadPageError ? <div className="main-content"><PageError /></div> : <div id="calendar" className="main-content">
                {loadData ? <LoaderElement /> : <>
                    <div className="toolbar">
                        <div className="item">
                            <Button onClick={this.handleAdd}>Ajouter un évènement</Button>
                        </div>
                        <div className="item filter-search">
                            <Filter ref={this.filter} filters={filters} items={itemsFilter} onGetFilters={this.handleGetFilters} />
                            <FilterSelected filters={filters} itemsFiltersLabel={filtersLabel} itemsFiltersId={filtersId} onChange={this.handleFilter}/>
                        </div>
                    </div>

                    <div className="ag-selectors">
                        <div className="title">Filtre par personnes</div>
                        <div className="line line-4">
                            <SelectReactSelectize items={selectUsers} identifiant="user" disabled={selActive !== "" && selActive !== "user"}
                                                  valeur={user} errors={errors} onChange={(e) => this.handleChangeSelect('user', e)}>
                                Utilisateur
                            </SelectReactSelectize>
                            <div className="form-group"/>
                            <div className="form-group"/>
                            <div className="form-group"/>
                        </div>
                    </div>
                    <FullCalendar
                        locale={frLocale}
                        initialView={initialView}
                        plugins={[ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ]}
                        headerToolbar={{
                            left: 'timeGridDay,timeGridWeek',
                            center: 'title',
                            right: 'prev,next'
                        }}
                        allDayText={""}
                        hiddenDays={[ 0 ]}
                        slotMinTime={"08:00:00"}
                        slotMaxTime={"22:00:00"}
                        eventMinHeight={60}
                        editable={true}
                        droppable={true}
                        events={events}
                        eventDidMount={this.handleEventDidMount}
                        eventDrop={this.handleEventDrop}
                        eventClick={this.handleEventClick}
                        dateClick={this.handleDateClick}
                    />

                    <Aside ref={this.aside} content={contentAside} />
                </>}
            </div>}
        </>
    }
}

function addEventElement (bloc, event, users, managers, negotiators, owners, tenants, prospects, buyers) {
    bloc.innerHTML = "";

    let props = event.extendedProps;

    bloc.insertAdjacentHTML('beforeend', '<div class="status status-' + props.status + '">' + props.statusString + '</div>')

    if(!event.allDay){
        let start = Sanitaze.toFormatTimeHoursMinutes(event.start);
        let end = event.end ? " - " + Sanitaze.toFormatTimeHoursMinutes(event.end) : "";

        bloc.insertAdjacentHTML('beforeend', '<div class="time">'+ start + end +'</div>')
    }

    bloc.insertAdjacentHTML('beforeend', '<div class="title">' + event.title + '</div>')
    if(props.location){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + props.location + '</div>')
    }
    if(props.comment){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub comment">' + props.comment + '</div>')
    }

    //persons
    let persons = props.persons;

    let data0 = getDataPerson(persons.users, users);
    let data1 = getDataPerson(persons.managers, managers);
    let data2 = getDataPerson(persons.negotiators, negotiators);
    let data3 = getDataPerson(persons.owners, owners);
    let data4 = getDataPerson(persons.tenants, tenants);
    let data5 = getDataPerson(persons.prospects, prospects);
    let data6 = getDataPerson(persons.buyers, buyers);

    let items0 = getPersonAvatar(data0);
    let items1 = getPersonAvatar(data1);
    let items2 = getPersonAvatar(data2);
    let items3 = getPersonTotal(data3, "propriétaire");
    let items4 = getPersonTotal(data4, "locataire");
    let items5 = getPersonTotal(data5, "prospect");
    let items6 = getPersonTotal(data6, "acquéreur");

    bloc.insertAdjacentHTML('beforeend', '<div class="persons">' +
        items0.join("") +
    '</div>')
    bloc.insertAdjacentHTML('beforeend', '<div class="persons">' +
        items1.join("") +
    '</div>')
    bloc.insertAdjacentHTML('beforeend', '<div class="persons">' +
        items2.join("") +
    '</div>')
    if(data3.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub">' +
            items3 +
        '</div>')
    }
    if(data4.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub">' +
            items4 +
        '</div>')
    }
    if(data5.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub">' +
            items5 +
            '</div>')
    }
    if(data6.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub">' +
            items6 +
            '</div>')
    }

}

function getDataPerson (data, correspondance) {
    let tab = [];
    if(data){
        data.forEach(person => {
            correspondance.forEach(item => {
                if(person.value === item.id){
                    tab.push(item)
                }
            })
        })
    }

    return tab;
}

function getPersonAvatar (data) {
    return data.map(elem => {
        return '<div class="person">' +
            '<img src="'+ elem.avatarFile +'" alt="'+ elem.lastname +'">' +
        '</div>'
    })
}

function getPersonTotal (data, name) {
    return data.length + " " + name + (data.length > 1 ? "s" : "");
}