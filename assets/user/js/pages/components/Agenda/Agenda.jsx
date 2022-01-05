import React, { Component } from "react";

import frLocale          from '@fullcalendar/core/locales/fr';
import FullCalendar      from "@fullcalendar/react";
import dayGridPlugin     from '@fullcalendar/daygrid';
import timeGridPlugin    from '@fullcalendar/timegrid';
import listPlugin        from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import Sanitaze          from "@commonComponents/functions/sanitaze";

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay"
        }

        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventDrop = this.handleEventDrop.bind(this);
        this.handleEventDidMount = this.handleEventDidMount.bind(this);
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
        console.log(e)
    }

    // click in case empty
    handleDateClick = (e) => {
        console.log(e)
    }

    render () {
        const { initialView } = this.state;

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
                events={[
                    {
                        id: 1,
                        title: "event 1",
                        date: "2022-01-05", // Sanitaze.toFormatDataAgenda(start)
                        allDay: true,
                        extendedProps: {
                            where: "Chez moi",
                        },
                        classNames: "event-1"
                    },
                    {
                        id: 2,
                        title: "event 2",
                        start: "2022-01-06 10:00:00",
                        end: "2022-01-06 10:30:00",
                        extendedProps: {
                            where: "Chez Logilink",
                        },
                        classNames: "event-2"
                    }
                ]}
                eventDidMount={this.handleEventDidMount}
                eventDrop={this.handleEventDrop}
                eventClick={this.handleEventClick}
                dateClick={this.handleDateClick}
            />
        </div>
    }
}

function addEventElement (bloc, event) {
    bloc.innerHTML = "";

    let props = event.extendedProps;

    if(!event.allDay){
        console.log(event)
        let start = Sanitaze.toFormatTimeHoursMinutes(event.start);
        let end = event.end ? " - " + Sanitaze.toFormatTimeHoursMinutes(event.end) : "";

        bloc.insertAdjacentHTML('beforeend', '<div class="title">'+ start + end +'</div>')
    }

    bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + event.title + '</div>')
    bloc.insertAdjacentHTML('beforeend', '<div class="sub">' + props.where + '</div>')
}