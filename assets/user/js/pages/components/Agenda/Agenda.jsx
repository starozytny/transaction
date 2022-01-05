import React, { Component } from "react";

import frLocale       from '@fullcalendar/core/locales/fr'
import FullCalendar   from "@fullcalendar/react";
import dayGridPlugin  from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin     from '@fullcalendar/list'
import {left} from "core-js/internals/array-reduce";

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay"
        }
    }

    render () {
        const { initialView } = this.state;

        return <div id="calendar" className="main-content">
            <FullCalendar
                locale={frLocale}
                plugins={[ dayGridPlugin, timeGridPlugin, listPlugin ]}
                initialView={initialView}
                hiddenDays={[ 0 ]}
                slotMinTime={"07:00:00"}
                slotMaxTime={"23:00:00"}
                allDayText={""}
                headerToolbar={{
                    left: 'timeGridDay,timeGridWeek',
                    center: 'title',
                    right: 'prev,next'
                }}
                eventMinHeight={60}
            />
        </div>
    }
}