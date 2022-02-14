import React, { Component } from 'react';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";

export class QuartiersItem extends Component {
    render () {
        const { elem, onDelete, onChangeContext } = this.props;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">{elem.name}</div>
                        </div>

                        <div className="col-2">
                            <div className="sub">{elem.zipcode} - {elem.city}</div>
                        </div>

                        <div className="col-3 actions">
                            {elem.isNative ? <div className="badge">Natif</div> : <>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}