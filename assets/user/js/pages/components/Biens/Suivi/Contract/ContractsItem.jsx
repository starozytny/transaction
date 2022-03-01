import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class ContractsItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete } = this.props

        return <div className="item">
            <div className="item-content">
                <div className="item-body ">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                            <div className="name">
                                <span>{elem.sellAtString}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="sub">{elem.sellByString}</div>
                        </div>
                        <div className="col-3">
                            <div className="sub">{elem.sellWhyString}</div>
                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
