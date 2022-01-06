import React, { Component } from "react";

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

import { AgendaFormulaire } from "@userPages/components/Agenda/AgendaForm";

const URL_DELETE_ELEMENT = 'api_agenda_slots_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cet évènement ?';

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            data: props.donnees ? JSON.parse(props.donnees) : [],
            users: props.users ? JSON.parse(props.users) : [],
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

    handleOpenAside = (context, elem) => {
        let title = context === "update" ? elem.title : "Ajouter un évènement";

        let element = elem;
        if(context === "update"){
            let props = elem.extendedProps;
            element = {
                id: elem.id,
                name: elem.title,
                allDay: elem.allDay,
                startAtJavascript: props.startAtJavascript,
                endAtJavascript: props.endAtJavascript,
                location: props.location,
                comment: props.comment,
                persons: props.persons,
                status: props.status,
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
        addEventElement(e.el, e.event, this.state.users);
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
        let url = Routing.generate(URL_DELETE_ELEMENT, {'id': parseInt(element.id)})
        Formulaire.axiosDeleteElement(this, element, url, MSG_DELETE_ELEMENT, 'Cette action est irréversible.');
    }

    render () {
        const { context, data, initialView, element, users } = this.state;

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
            // console.log(JSON.parse(elem.persons)) // get persons
            events.push({
                id: elem.id,
                title: elem.name,
                start: elem.startAtAgenda,
                end: elem.endAtAgenda,
                allDay: elem.allDay,
                extendedProps: {
                    location: elem.location,
                    comment: elem.comment,
                    persons: JSON.parse(elem.persons),
                    startAtJavascript: elem.startAtJavascript,
                    endAtJavascript: elem.endAtJavascript,
                    status: elem.status,
                    statusString: elem.statusString,
                },
                classNames: "event event-" + elem.status
            })
        })

        return <div id="calendar" className="main-content">
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
        </div>
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
    bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + props.location + '</div>')
    bloc.insertAdjacentHTML('beforeend', '<div class="sub comment">' + props.comment + '</div>')

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