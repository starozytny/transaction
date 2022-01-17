import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class SearchsItem extends Component {
    render () {
        const { elem, onDelete, onSelectors, onChangeContext } = this.props;

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-5">
                        <div className="col-1">
                            {elem.id}
                        </div>

                        <div className="col-2">
                            Localisation
                        </div>

                        <div className="col-3">
                            Infos
                        </div>

                        <div className="col-4">
                            Plus
                        </div>

                        <div className="col-5 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}