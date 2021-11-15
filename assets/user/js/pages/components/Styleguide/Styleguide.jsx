import React, { Component } from "react";

import { StyleguideForm }      from "./components/StyleguideForm";
import { StyleguideTable }     from "./components/StyleguideTable";
import { StyleguideAside }     from "./components/StyleguideAside";
import { StyleguideAlert }     from "./components/StyleguideAlert";
import { StyleguideButton }    from "./components/StyleguideButton";
import { StyleguideCard }      from "./components/StyleguideCard";

export class Styleguide extends Component {
    render () {
        return <div className="main-content">
            <StyleguideCard />
            <StyleguideAlert />
            <StyleguideButton />
            <StyleguideForm />
            <StyleguideAside />
            <StyleguideTable />
        </div>
    }
}