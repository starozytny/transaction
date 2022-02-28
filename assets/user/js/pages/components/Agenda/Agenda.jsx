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
                let person = false;
                switch (filter){
                    case 6:
                        person = "prospects";
                        break;
                    case 5:
                        person = "buyers";
                        break;
                    case 4:
                        person = "tenants";
                        break;
                    case 3:
                        person = "owners";
                        break;
                    case 2:
                        person = "negotiators";
                        break;
                    case 1:
                        person = "managers";
                        break;
                    case 0:
                        person = "users";
                        break;
                    // ci-dessous, filter by selectors
                    case "all":
                        push = true;
                        break;
                    default:
                        if(el.persons && el.persons[filter]){
                            el.persons[filter].forEach(u => {
                                if(parseInt(u.value) === parseInt(search)){
                                    push = true;
                                }
                            })
                        }
                        break;
                }

                if(person){
                    if(el.persons && el.persons[person] && el.persons[person].length > 0){
                        push = true;
                    }
                }

                if(push){
                    newData.filter(elem => elem.id !== el.id)
                    newData = [...newData, ...[el]];
                }
            })
        })
    }

    return newData;
}

function setSelectorDefault(name, type, search){
    return type && type === name ? parseInt(search) : "";
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
            selActive: props.type ? props.type : "",
            user: setSelectorDefault("user", props.type, props.search),
            manager: setSelectorDefault("manager", props.type, props.search),
            negotiator: setSelectorDefault("negotiator", props.type, props.search),
            owner: setSelectorDefault("owner", props.type, props.search),
            tenant: setSelectorDefault("tenant", props.type, props.search),
            buyer: setSelectorDefault("buyer", props.type, props.search),
            prospect: setSelectorDefault("prospect", props.type, props.search),
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
        let newData = filterFunction(dataImmuable, search !== "" ? [name + "s"] : ["all"], search);
        let newData1 = filterFunction(newData, filters);

        this.setState({ data: newData1, filters: filters, [name]: search, selActive: search === "" ? "" : name });
    }

    handleGetFilters = (filters, dataIm = null) => {
        const { dataImmuable } = this.state;

        let newData = filterFunction(dataIm ? dataIm : dataImmuable, filters);
        newData = [...new Set(newData)];

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
            filters, selActive, user, manager, negotiator, owner, tenant, buyer, prospect } = this.state;

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

        let filtersLabel = ["Utilisateurs", "Managers", "Négociateurs", "Propriétaires", "Locataires", "Acquéreurs", "Prospects"];
        let filtersId    = ["ff-user", "ff-mana", "ff-nego", "ff-ow", "ff-ten", "ff-ac", "ff-pr"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0] },
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2] },
            { value: 3, id: filtersId[3], label: filtersLabel[3] },
            { value: 4, id: filtersId[4], label: filtersLabel[4] },
            { value: 5, id: filtersId[5], label: filtersLabel[5] },
            { value: 6, id: filtersId[6], label: filtersLabel[6] },
        ];

        let selectUsers         = AgendaData.getSelecteurData(users, 'sp-user');
        let selectManagers      = AgendaData.getSelecteurData(managers, 'sp-ma');
        let selectNegotiators   = AgendaData.getSelecteurData(negotiators, 'sp-ne');
        let selectOwners        = AgendaData.getSelecteurData(owners, 'sp-ow');
        let selectTenants       = AgendaData.getSelecteurData(tenants, 'sp-te');
        let selectBuyers        = AgendaData.getSelecteurData(buyers, 'sp-by');
        let selectProspects     = AgendaData.getSelecteurData(prospects, 'sp-pr');

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
                        <div className="line line-3">
                            <SelectReactSelectize items={selectUsers} identifiant="user" disabled={selActive !== "" && selActive !== "user"}
                                                  valeur={user} errors={errors} onChange={(e) => this.handleChangeSelect('user', e)}>
                                Utilisateur
                            </SelectReactSelectize>
                            <SelectReactSelectize items={selectManagers} identifiant="manager" disabled={selActive !== "" && selActive !== "manager"}
                                                  valeur={manager} errors={errors} onChange={(e) => this.handleChangeSelect('manager', e)}>
                                Manager
                            </SelectReactSelectize>
                            <SelectReactSelectize items={selectNegotiators} identifiant="negotiator" disabled={selActive !== "" && selActive !== "negotiator"}
                                                  valeur={negotiator} errors={errors} onChange={(e) => this.handleChangeSelect('negotiator', e)}>
                                Négociateur
                            </SelectReactSelectize>
                        </div>
                        <div className="line line-4">
                            <SelectReactSelectize items={selectOwners} identifiant="owner" disabled={selActive !== "" && selActive !== "owner"}
                                                  valeur={owner} errors={errors} onChange={(e) => this.handleChangeSelect('owner', e)}>
                                Propriétaire
                            </SelectReactSelectize>
                            <SelectReactSelectize items={selectTenants} identifiant="tenant" disabled={selActive !== "" && selActive !== "tenant"}
                                                  valeur={tenant} errors={errors} onChange={(e) => this.handleChangeSelect('tenant', e)}>
                                Locataire
                            </SelectReactSelectize>
                            <SelectReactSelectize items={selectBuyers} identifiant="buyer" disabled={selActive !== "" && selActive !== "buyer"}
                                                  valeur={buyer} errors={errors} onChange={(e) => this.handleChangeSelect('buyer', e)}>
                                Acquéreur
                            </SelectReactSelectize>
                            <SelectReactSelectize items={selectProspects} identifiant="prospect" disabled={selActive !== "" && selActive !== "prospect"}
                                                  valeur={prospect} errors={errors} onChange={(e) => this.handleChangeSelect('prospect', e)}>
                                Prospect
                            </SelectReactSelectize>
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
    let items3 = getPersonTotal(data3, "Propriétaire");
    let items4 = getPersonTotal(data4, "Locataire");
    let items5 = getPersonTotal(data5, "Prospect");
    let items6 = getPersonTotal(data6, "Acquéreur");

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
        bloc.insertAdjacentHTML('beforeend', '<div class="sub sub-persons">'
            + '<span class="ag-round">' + data3.length + '</span>' + items3 +
        '</div>')
    }
    if(data4.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub sub-persons">'
            + '<span class="ag-round">' + data4.length + '</span>' + items4 +
        '</div>')
    }
    if(data5.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub sub-persons">'
            + '<span class="ag-round">' + data5.length + '</span>' + items5 +
        '</div>')
    }
    if(data6.length > 0){
        bloc.insertAdjacentHTML('beforeend', '<div class="sub sub-persons">'
            + '<span class="ag-round">' + data6.length + '</span>' + items6 +
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
    return " " + name + (data.length > 1 ? "s" : "");
}
