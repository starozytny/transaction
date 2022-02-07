import React, { Component } from 'react';

import { Alert }          from "@dashboardComponents/Tools/Alert";

import { AgenciesItem }   from "./AgenciesItem";

export class AgenciesList extends Component {
    render () {
        const { role, data, idAgency, isUser, onChangeContext } = this.props;

        return <>
            <div>
                {data && data.length !== 0 ? data.map(elem => {
                    return <AgenciesItem role={role} elem={elem} idAgency={idAgency} isUser={isUser} onChangeContext={onChangeContext} key={elem.id}/>
                }) : <Alert>Aucun résultat</Alert>}
            </div>
        </>
    }
}