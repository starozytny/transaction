import React, { Component } from "react";

import { Aside } from "@dashboardComponents/Tools/Aside";

import frLocale          from '@fullcalendar/core/locales/fr';
import FullCalendar      from "@fullcalendar/react";
import dayGridPlugin     from '@fullcalendar/daygrid';
import timeGridPlugin    from '@fullcalendar/timegrid';
import listPlugin        from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import Sanitaze          from "@commonComponents/functions/sanitaze";

import { AgendaFormulaire } from "@userPages/components/Agenda/AgendaForm";

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            data: JSON.parse(props.donnees),
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay"
        }

        this.aside = React.createRef();

        this.handleOpenAside = this.handleOpenAside.bind(this);

        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventDrop = this.handleEventDrop.bind(this);
        this.handleEventDidMount = this.handleEventDidMount.bind(this);
    }

    handleOpenAside = (context, elem) => {
        let time = context === "create" ? Sanitaze.toFormatTimeHoursMinutes(elem.date) : "";
        let title = context === "update" ? elem.title : "Ajouter un évènement " + (time === "00h00" ? "pour la journée" : "à " + time);

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

    // init event
    handleEventDidMount = (e) => {
        addEventElement(e.el, e.event);
    }

    // move event
    handleEventDrop = (e) => {
        addEventElement(e.el, e.event);
    }

    // edit event
    handleEventClick = (e) => {
        this.handleOpenAside("update", e.event)
    }

    // click in case empty
    handleDateClick = (e) => {
        this.handleOpenAside("create", e)
    }

    render () {
        const { context, data, initialView, element } = this.state;

        let contentAside;
        switch (context){
            case "create":
                contentAside = <AgendaFormulaire type="create" />
                break;
            case "update":
                contentAside = <AgendaFormulaire type="update" element={element} />
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
                    persons: elem.persons,
                    startAtJavascript: elem.startAtJavascript,
                    endAtJavascript: elem.endAtJavascript,
                    status: elem.status,
                    statusString: elem.statusString,
                },
                classNames: "event event-" + elem.status
            })
        })

        return <div id="calendar" className="main-content">
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

function addEventElement (bloc, event) {
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
}