import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class NegotiatorsItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <div className="role">{elem.code}</div>
                                <span>{elem.lastname} {elem.firstname}</span>
                            </div>
                            <div className="sub">{elem.email}</div>
                        </div>
                        <div className="col-2">
                            {elem.phone && <div className="sub">{elem.phone}</div>}
                            {elem.phone2 && <div className="sub">{elem.phone2}</div>}
                            {elem.fullTransportString !== null ? <div className="sub">{elem.fullTransportString}</div> : ""}
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}