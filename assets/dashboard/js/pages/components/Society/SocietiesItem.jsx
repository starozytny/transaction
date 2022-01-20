import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class SocietiesItem extends Component {
    render () {
        const { developer, elem, onChangeContext, onSelectors, onDelete } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-2">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.name}</span>
                                <span className="role">#{elem.code}</span>
                            </div>
                        </div>
                        <div className="col-2 actions">
                            {developer === 1 && <>
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