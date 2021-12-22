import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class OwnersItem extends Component {
    render () {
        const { isClient, biens, elem, onDelete, onSelectors, onChangeContext } = this.props;

        let totalBien = 0;
        biens.forEach(bien => {
            if(bien.owner && bien.owner.id === elem.id){
                totalBien++;
            }
        })

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="badges">
                                <div className="badge">{elem.code}</div>
                                {elem.isGerance && <>
                                    <div className="badge default">{elem.codeGerance}</div>
                                    <div className="badge default">{elem.folderGerance}</div>
                                </>}
                            </div>
                            <div className="name">
                                <span>{elem.fullname}</span>
                            </div>
                            {!isClient && <div className="sub">{elem.society.fullname}</div>}
                            {/*<div>{elem.biens.length}</div>*/}
                            <div className="sub">{totalBien} bien{totalBien > 1 ? "s" : ""}</div>
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
                            {!elem.isGerance && <>
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