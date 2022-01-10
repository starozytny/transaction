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

import { Aside }         from "@dashboardComponents/Tools/Aside";
import { Button }        from "@dashboardComponents/Tools/Button";

import { PageError }        from "@dashboardComponents/Layout/PageError";
import { AgendaFormulaire } from "@userPages/components/Agenda/AgendaForm";
import {LoaderElement} from "@dashboardComponents/Layout/Loader";

const URL_DELETE_ELEMENT = 'api_agenda_events_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cet évènement ?';
const URL_UPDATE_ELEMENT_DATE = 'api_agenda_events_update_date';
const URL_GET_DATA            = 'api_agenda_data_persons';

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            data: props.donnees ? JSON.parse(props.donnees) : [],
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay"
        }

        this.aside = React.createRef();

        this.handleOpenAside = this.handleOpenAside.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventDrop = this.handleEventDrop.bind(this);
        this.handleEventDidMount = this.handleEventDidMount.bind(this);
    }

    componentDidMount = () => {
        const self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {}})
            .then(function (response) {
                let data = response.data;
                let users = JSON.parse(data.users)
                self.setState({ users: users })
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error)
                self.setState({ loadPageError: true });
            })
            .then(function () {
                Formulaire.loader(false);
                self.setState({ loadData: false });
            })
        ;
    }

    handleOpenAside = (context, elem) => {
        let title = context === "update" ? elem.title : "Ajouter un évènement";

        let element = elem;
        if(context === "update"){
            let props = elem.extendedProps;
            element = {
                id: parseInt(elem.id),
                name: elem.title,
                allDay: elem.allDay,
                startAtJavascript: props.startAtJavascript,
                endAtJavascript: props.endAtJavascript,
                location: props.location,
                comment: props.comment,
                persons: props.persons,
                status: props.status,
                visibilities: props.visibilities,
            }
        }

        this.setState({ context, element })
        this.aside.current.handleOpen(title);
    }

    handleUpdateList = (element, newContext=null) => {
        const { data, context } = this.state

        let nContext = (newContext !== null) ? newContext : context;
        let newData = UpdateList.update(nContext, data, element);

        this.setState({
            data: newData,
            element: element
        })
    }

    // init event
    handleEventDidMount = (e) => {
        addEventElement(e.el, e.event, this.state.users);
    }

    // move event
    handleEventDrop = (e) => {
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
                            addEventElement(e.el, e.event, self.state.users);
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
        const { context, loadPageError, loadData, data, initialView, element, users } = this.state;

        let contentAside;
        switch (context){
            case "create":
                contentAside = <AgendaFormulaire type="create" custom={element} users={users} onUpdateList={this.handleUpdateList} />
                break;
            case "update":
                contentAside = <AgendaFormulaire type="update" element={element} users={users}
                                                 onUpdateList={this.handleUpdateList} onDelete={() => this.handleDelete(element)} />
                break;
            default:
                break;
        }

        let events = [];
        data.forEach(elem => {
            events.push({
                id: elem.id,
                title: elem.name,
                start: elem.startAtAgenda,
                end: elem.endAtAgenda,
                allDay: elem.allDay,
                extendedProps: {
                    location: elem.location,
                    comment: elem.comment,
                    persons: elem.persons,
                    startAtJavascript: elem.startAtJavascript,
                    endAtJavascript: elem.endAtJavascript,
                    status: elem.status,
                    statusString: elem.statusString,
                    visibilities: elem.visibilities,
                },
                classNames: "event event-" + elem.status
            })
        })

        return <>
            {loadPageError ? <PageError /> : <div id="calendar" className="main-content">
                {loadData ? <LoaderElement /> : <>
                    <div className="toolbar">
                        <div className="item">
                            <Button onClick={this.handleAdd}>Ajouter un évènement</Button>
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

function addEventElement (bloc, event, users) {
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

    let data0 = [];
    if(persons.users){
        persons.users.forEach(person => {
            users.forEach(user => {
                if(person.value === user.id){
                    data0.push(user)
                }
            })
        })
    }

    if(data0.length !== 0){
        let items = data0.map(elem => {
            return '<div class="person">' +
                '<img src="'+ elem.avatarFile +'" alt="'+ elem.lastname +'">' +
                '</div>'
        })

        bloc.insertAdjacentHTML('beforeend', '<div class="persons">' +
            items.join("") +
        '</div>')
    }

}