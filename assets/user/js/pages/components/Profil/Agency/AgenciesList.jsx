import React, { Component } from 'react';

import { Alert }          from "@dashboardComponents/Tools/Alert";

import { AgenciesItem }   from "./AgenciesItem";

export class AgenciesList extends Component {
    render () {
        const { data, idAgency, isUser, onChangeContext } = this.props;

        return <>
            <div>
                {data && data.length !== 0 ? data.map(elem => {
                    return <AgenciesItem elem={elem} idAgency={idAgency} isUser={isUser} onChangeContext={onChangeContext} key={elem.id}/>
                }) : <Alert>Aucun résultat</Alert>}
            </div>
        </>
    }
}