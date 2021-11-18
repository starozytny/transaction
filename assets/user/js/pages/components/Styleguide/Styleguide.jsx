import React, { Component } from "react";

import { StyleguideForm }      from "./components/StyleguideForm";
import { StyleguideTable }     from "./components/StyleguideTable";
import { StyleguideAside }     from "./components/StyleguideAside";
import { StyleguideAlert }     from "./components/StyleguideAlert";
import { StyleguideButton }    from "./components/StyleguideButton";
import { StyleguideCard }      from "./components/StyleguideCard";
import { StyleguidePage }      from "./components/StyleguidePage";

export class Styleguide extends Component {
    render () {
        return <div className="main-content">
            <StyleguidePage />
            <StyleguideCard />
            <StyleguideAlert />
            <StyleguideButton />
            <StyleguideForm />
            <StyleguideAside />
            <StyleguideTable />
        </div>
    }
}