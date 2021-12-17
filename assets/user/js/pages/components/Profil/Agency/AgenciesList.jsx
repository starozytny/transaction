import React, { Component } from 'react';

import { Alert }          from "@dashboardComponents/Tools/Alert";

import { AgenciesItem }   from "./AgenciesItem";

export class AgenciesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: JSON.parse(props.donnees)
        }
    }
    render () {
        const { isUser } = this.props;
        const { data } = this.state;

        return <>
            <div>
                {data && data.length !== 0 ? data.map(elem => {
                    return <AgenciesItem elem={elem} isUser={isUser} key={elem.id}/>
                }) : <Alert>Aucun résultat</Alert>}
            </div>
        </>
    }
}