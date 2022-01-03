import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class OwnersItem extends Component {
    render () {
        const { isClient, isFormBien, owner, biens, elem, onDelete, onSelectors, onChangeContext, onSelectOwner } = this.props;

        let totalBien = 0;
        biens.forEach(bien => {
            if(bien.owner && bien.owner.id === elem.id){
                totalBien++;
            }
        })

        return <div className="item" onClick={() => onSelectOwner(elem)}>
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isFormBien && <div className="selector">
                <label className={"item-selector " + (owner === elem.id)}/>
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className={"infos infos-col-" + (isFormBien ? "3" : "4")}>
                        <div className="col-1">
                            <OwnerMainInfos elem={elem} />
                            {!isClient && <div className="sub">{elem.society.fullname}</div>}
                            {biens.length !== 0 && <div className="sub">{totalBien} bien{totalBien > 1 ? "s" : ""}</div>}
                        </div>

                        {!isFormBien && <div className="col-2">
                            <OwnerContact elem={elem} />
                        </div>}

                        <div className={isFormBien ? "col-2" : "col-3"}>
                            <OwnerNegotiator elem={elem} />
                        </div>
                        <div className="col-4 actions">
                            {!elem.isGerance && <>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                {!isFormBien && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export function OwnerMainInfos ({ elem }) {
    return <>
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
    </>
}

export function OwnerContact ({ elem }) {
    return <>
        <div className="sub">{elem.email}</div>
        <div className="sub">{elem.phone1}</div>
        <div className="sub">{elem.phone2}</div>
        <div className="sub">{elem.phone3}</div>
    </>
}

export function OwnerNegotiator ({ elem }) {
    return <>
        <div className="sub">{elem.negotiator ? elem.negotiator.fullname : "/"}</div>
    </>
}