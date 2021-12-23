import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class TenantsItem extends Component {
    render () {
        const { isClient, elem, onDelete, onSelectors, onChangeContext } = this.props;

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.lastname}</span>
                            </div>
                            {!isClient && <div className="sub">{elem.agency.name}</div>}
                        </div>
                        <div className="col-2">
                            <div className="sub">{elem.email}</div>
                            <div className="sub">{elem.phone1}</div>
                            <div className="sub">{elem.phone2}</div>
                            <div className="sub">{elem.phone3}</div>
                        </div>
                        <div className="col-3">
                            <div className="sub">{elem.negotiator ? elem.negotiator.fullname : "/"}</div>
                        </div>
                        <div className="col-4 actions">
                            {elem.bien && <ButtonIcon icon="home">Bien</ButtonIcon>}
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}