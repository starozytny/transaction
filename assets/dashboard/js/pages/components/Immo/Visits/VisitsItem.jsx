import React, { Component } from 'react';

import parse from "html-react-parser";
import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class VisitsItem extends Component {
    render () {
        const { elem, onDelete, onChangeContext } = this.props;

        let event = elem.agEvent;
        let persons = event.persons;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">
                                {event.name}
                            </div>
                            <div className="sub">{parse(event.fullDate)}</div>
                            {event.location && <div className="sub">{event.location}</div>}
                            {event.comment && <div className="sub">{event.comment}</div>}
                        </div>
                        <div className="col-2">
                            <Person type={0} data={persons.users} name="Utilisateur"/>
                            <Person type={1} data={persons.managers} name="Manager"/>
                            <Person type={2} data={persons.negotiators} name="Négociateur"/>
                            <Person type={3} data={persons.owners} name="Propriétaire"/>
                            <Person type={4} data={persons.tenants} name="Locataire"/>
                            <Person type={5} data={persons.prospects} name="Prospect"/>
                        </div>
                        <div className="col-3">

                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

function Person ({ data, name, type }) {
    let items = [];
    data.length !== 0 && data.forEach(el => {
        items.push(<div className="sub person" key={el.value}><span className={"badge badge-" + type}>{name}</span> - {el.label}</div>)
    })
    return items.length > 0 ? items : null;
}