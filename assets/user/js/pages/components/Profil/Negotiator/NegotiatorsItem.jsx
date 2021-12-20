import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class NegotiatorsItem extends Component {
    render () {
        const { isUser, elem, onDelete, onChangeContext } = this.props

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <div className="role">{elem.code}</div>
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                            <div className="sub">{elem.email}</div>
                            <div className="sub">{elem.agency.name}</div>
                        </div>
                        <div className="col-2">
                            {elem.phone && <div className="sub">{elem.phone}</div>}
                            {elem.phone2 && <div className="sub">{elem.phone2}</div>}
                            {elem.fullTransportString !== null ? <div className="sub">{elem.fullTransportString}</div> : ""}
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            {!isUser && <>
                                <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}