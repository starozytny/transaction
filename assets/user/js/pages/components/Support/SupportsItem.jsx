import React, { Component } from 'react';

import { ButtonIcon } from "@dashboardComponents/Tools/Button";

export class SupportsItem extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="badge badge-default">#00{elem.code}</div>
                            <div className="name">{elem.name}</div>
                            <div className={"sub" + (!elem.filename ? " txt-danger" : "")}>Nom du fichier : {elem.filename ? elem.filename : "A définir"}</div>
                        </div>

                        <div className="col-2">
                            <div className="sub">{elem.ftpServer}</div>
                            <div className="sub">Port : {elem.ftpPort}</div>
                            <div className="sub">{elem.ftpUser}</div>
                            <div className="sub">{elem.ftpPassword}</div>
                            <div className="sub">{elem.maxPhotos} photos max</div>
                        </div>

                        <div className="col-3 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}